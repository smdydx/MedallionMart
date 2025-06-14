import { Express } from "express";
import session from "express-session";
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

export function setupAuth(app: Express) {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'medallion-mart-secret-key-super-secure-random-string',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset expiration on activity
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true, // Prevent XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax' // CSRF protection
    }
  }));

  // Auth middleware to check session
  app.use((req, res, next) => {
    if (req.session && (req.session as any).user) {
      req.user = (req.session as any).user;
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