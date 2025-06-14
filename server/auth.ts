import { Express } from "express";
import session from "express-session";
import crypto from "crypto";
import { storage } from "./storage";
import { InsertUser } from "@shared/schema";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: string;
      };
    }
  }
}

// Password hashing utility functions
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return salt + ':' + hash;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const parts = hashedPassword.split(':');
  if (parts.length !== 2) return false;
  
  const salt = parts[0];
  const hash = parts[1];
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

export function setupAuth(app: Express) {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'medallion-mart-secret-key-super-secure-random-string',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset expiration on activity
    name: 'medallion.sid', // Custom session name
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true, // Prevent XSS attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax' // CSRF protection
    }
  }));

  // Auth middleware to check session
  app.use((req, res, next) => {
    try {
      if (req.session && (req.session as any).user) {
        req.user = (req.session as any).user;
      }
    } catch (error) {
      console.error('Session middleware error:', error);
    }
    next();
  });
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// Middleware to check if user is admin
export function isAdmin(req: any, res: any, next: any) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
}