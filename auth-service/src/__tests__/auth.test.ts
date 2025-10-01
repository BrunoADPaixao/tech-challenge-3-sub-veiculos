import request from "supertest";
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

import { app } from "../server";

describe("Auth Service", () => {
  let prisma: PrismaClient;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = new PrismaClient();
  });

  describe("POST /register", () => {
    it("should create a new user and return it", async () => {
      const userData = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(userData);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");

      const response = await request(app).post("/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: userData.id,
        name: userData.name,
        email: userData.email,
      });
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("/register")
        .send({ name: "Test User" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Todos os campos são obrigatórios.");
    });
  });

  describe("POST /login", () => {
    it("should login a user and return a JWT token", async () => {
      const user = {
        id: "1",
        email: "test@example.com",
        password: "hashedpassword",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("fake_jwt_token");

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe("fake_jwt_token");
    });

    it("should return 404 if user is not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/login")
        .send({ email: "notfound@example.com", password: "password123" });

      expect(response.status).toBe(404);
    });

    it("should return 401 for invalid password", async () => {
      const user = {
        id: "1",
        email: "test@example.com",
        password: "hashedpassword",
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "wrongpassword" });

      expect(response.status).toBe(401);
    });
  });
});
