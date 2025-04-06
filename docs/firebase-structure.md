# Firebase Structure Documentation

This document outlines the Firebase structure used in the Nile University Platform application.

## Authentication

The application uses Firebase Authentication with the following methods:
- Email/Password authentication
- Email verification
- Password reset

## Firestore Database Structure

### Collections

#### `users`
Stores user profile information.

**Document ID**: User's UID from Firebase Authentication
**Fields**:
- `email`: string - User's email address
- `display_name`: string - User's full name
- `department`: string (optional) - User's department
- `student_id`: string (optional) -

