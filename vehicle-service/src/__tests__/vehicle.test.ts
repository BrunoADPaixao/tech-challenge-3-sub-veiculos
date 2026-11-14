import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { app } from "../server";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    vehicle: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock("../middleware/auth", () => ({
  authenticateToken: (req, res, next) => {
    req.user = { userId: "mock-user-id" };
    next();
  },
}));

describe("Vehicle Service", () => {
  let prisma: PrismaClient;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = new PrismaClient();
  });

  describe("POST /vehicles", () => {
    it("should create a new vehicle", async () => {
      const vehicleData = {
        brand: "Test Brand",
        model: "Test Model",
        year: 2025,
        color: "Black",
        price: 10000,
      };
      (prisma.vehicle.create as jest.Mock).mockResolvedValue(vehicleData);

      const response = await request(app).post("/vehicles").send(vehicleData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(vehicleData);
    });
  });

  describe("PUT /vehicles/:id", () => {
    it("should not allow editing a sold vehicle", async () => {
      const soldVehicle = { status: "SOLD" };
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(soldVehicle);

      const response = await request(app)
        .put("/vehicles/1")
        .send({ price: 12000 });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain("Não é permitido editar");
    });
  });

  describe("POST /vehicles/:id/buy", () => {
    it("should allow a user to buy a vehicle", async () => {
      const vehicleForSale = { id: "1", status: "FOR_SALE" };
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(
        vehicleForSale
      );
      (prisma.vehicle.update as jest.Mock).mockResolvedValue({
        ...vehicleForSale,
        status: "SOLD",
        buyerId: "mock-user-id",
      });

      const response = await request(app).post("/vehicles/1/buy");

      expect(response.status).toBe(200);
      expect(response.body.message).toContain("Compra realizada com sucesso");
      expect(response.body.vehicle.status).toBe("SOLD");
    });

    it("should return an error if vehicle is already sold", async () => {
      const soldVehicle = { id: "1", status: "SOLD" };
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(soldVehicle);

      const response = await request(app).post("/vehicles/1/buy");

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Este veículo já foi vendido");
    });
  });

  describe("GET /vehicles/forsale", () => {
    it("should return a list of vehicles for sale", async () => {
      const vehicles = [{ id: "1", status: "FOR_SALE" }];
      (prisma.vehicle.findMany as jest.Mock).mockResolvedValue(vehicles);

      const response = await request(app).get("/vehicles/forsale");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(vehicles);
    });
  });
});
