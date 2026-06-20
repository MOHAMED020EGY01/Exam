/**
 * user-Interface.tsx
 *
 * Purpose:
 * TypeScript interface representing an authenticated user profile.
 *
 * Responsibilities:
 * - Define fields representing the User entity
 */

export interface User {
    name: string;
    email: string;
    id: number;
    avatar:string
}