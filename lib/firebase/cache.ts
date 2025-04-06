"use client"

import { getFirebaseDb } from "@/lib/firebase/firebase-client"
import { doc, getDoc, getDocs, collection, query, type QueryConstraint } from "firebase/firestore"

// Cache configuration
const DEFAULT_CACHE_TIME = 5 * 60 * 1000 // 5 minutes in milliseconds
const CACHE_PREFIX = "firestore_cache_"

// Cache interface
interface CacheItem<T> {
  data: T
  timestamp: number
  expiry: number
}

// Save data to cache
function saveToCache<T>(key: string, data: T, expiryTime: number = DEFAULT_CACHE_TIME): void {
  if (typeof window === "undefined") return

  const cacheKey = `${CACHE_PREFIX}${key}`
  const timestamp = Date.now()
  const expiry = timestamp + expiryTime

  const cacheItem: CacheItem<T> = {
    data,
    timestamp,
    expiry,
  }

  try {
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem))
  } catch (error) {
    console.warn("Failed to save to cache:", error)
  }
}

// Get data from cache
function getFromCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null

  const cacheKey = `${CACHE_PREFIX}${key}`

  try {
    const cachedData = localStorage.getItem(cacheKey)
    if (!cachedData) return null

    const cacheItem: CacheItem<T> = JSON.parse(cachedData)

    // Check if cache has expired
    if (Date.now() > cacheItem.expiry) {
      localStorage.removeItem(cacheKey)
      return null
    }

    return cacheItem.data
  } catch (error) {
    console.warn("Failed to get from cache:", error)
    return null
  }
}

// Clear cache for a specific key
export function clearCache(key: string): void {
  if (typeof window === "undefined") return

  const cacheKey = `${CACHE_PREFIX}${key}`
  localStorage.removeItem(cacheKey)
}

// Clear all cache
export function clearAllCache(): void {
  if (typeof window === "undefined") return

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key)
    }
  })
}

// Get document with cache
export async function getCachedDoc<T>(
  collectionPath: string,
  docId: string,
  expiryTime: number = DEFAULT_CACHE_TIME,
): Promise<T | null> {
  const cacheKey = `${collectionPath}_${docId}`

  // Try to get from cache first
  const cachedData = getFromCache<T>(cacheKey)
  if (cachedData) {
    return cachedData
  }

  // If not in cache or expired, fetch from Firestore
  try {
    const db = await getFirebaseDb()
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const docRef = doc(db, collectionPath, docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    const data = docSnap.data() as T

    // Save to cache
    saveToCache<T>(cacheKey, data, expiryTime)

    return data
  } catch (error) {
    console.error("Error fetching document:", error)
    return null
  }
}

// Get collection with cache
export async function getCachedCollection<T>(
  collectionPath: string,
  constraints: QueryConstraint[] = [],
  expiryTime: number = DEFAULT_CACHE_TIME,
): Promise<T[]> {
  // Create a unique cache key based on the collection path and constraints
  const constraintsKey = constraints.map((c) => c.toString()).join("_")
  const cacheKey = `${collectionPath}_${constraintsKey}`

  // Try to get from cache first
  const cachedData = getFromCache<T[]>(cacheKey)
  if (cachedData) {
    return cachedData
  }

  // If not in cache or expired, fetch from Firestore
  try {
    const db = await getFirebaseDb()
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const q =
      constraints.length > 0 ? query(collection(db, collectionPath), ...constraints) : collection(db, collectionPath)

    const querySnapshot = await getDocs(q)

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[]

    // Save to cache
    saveToCache<T[]>(cacheKey, data, expiryTime)

    return data
  } catch (error) {
    console.error("Error fetching collection:", error)
    return []
  }
}

