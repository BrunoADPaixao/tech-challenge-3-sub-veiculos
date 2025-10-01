import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { authenticateToken, AuthRequest } from "./middleware/auth";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// Endpoint para cadastrar um novo veículo
app.post("/vehicles", async (req: Request, res: Response) => {
  const { brand, model, year, color, price } = req.body;
  try {
    const vehicle = await prisma.vehicle.create({
      data: { brand, model, year, color, price },
    });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: "Não foi possível cadastrar o veículo." });
  }
});

// Endpoint para editar um veículo
app.put("/vehicles/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "O ID do veículo é obrigatório." });
  }

  const { brand, model, year, color, price } = req.body;
  try {
    // Buscar o estado atual do veículo no banco
    const vehicleToUpdate = await prisma.vehicle.findUnique({
      where: { id },
    });

    // Verifica se o veículo realmente existe
    if (!vehicleToUpdate) {
      return res.status(404).json({ error: "Veículo não encontrado." });
    }

    // Se o veículo já foi vendido, retorna um erro e impede a edição.
    if (vehicleToUpdate.status === "SOLD") {
      return res.status(403).json({
        error: "Não é permitido editar um veículo que já foi vendido.",
      });
    }

    // Passo 3: Se todas as verificações passaram, executa a atualização
    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: { brand, model, year, color, price },
    });

    res.json(updatedVehicle);
  } catch (error) {
    console.error(error); // Log do erro no servidor para depuração
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao tentar editar o veículo." });
  }
});
// Endpoint seguro para permitir a compra do veículo
app.post(
  "/vehicles/:id/buy",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "O ID do veículo é obrigatório." });
    }

    const buyerId = req.user?.userId;

    if (!buyerId) {
      return res.status(403).json({
        error: "A informação do usuário não foi encontrada no token.",
      });
    }

    try {
      const vehicleToBuy = await prisma.vehicle.findUnique({
        where: { id },
      });

      if (!vehicleToBuy) {
        return res.status(404).json({ error: "Veículo não encontrado." });
      }

      if (vehicleToBuy.status === "SOLD") {
        return res.status(400).json({ error: "Este veículo já foi vendido." });
      }

      const updatedVehicle = await prisma.vehicle.update({
        where: { id },
        data: {
          status: "SOLD",
          buyerId: buyerId,
        },
      });
      res.json({
        message: "Compra realizada com sucesso!",
        vehicle: updatedVehicle,
      });
    } catch (error) {
      res.status(500).json({ error: "Ocorreu um erro ao processar a compra." });
    }
  }
);

// Endpoint para listagem de veículos à venda
app.get("/vehicles/forsale", async (req: Request, res: Response) => {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "FOR_SALE" },
    orderBy: { price: "asc" },
  });
  res.json(vehicles);
});

// Endpoint para listagem de veículos vendidos
app.get("/vehicles/sold", async (req: Request, res: Response) => {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "SOLD" },
    orderBy: { price: "asc" },
  });
  res.json(vehicles);
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Vehicle service running on port ${PORT}`);
});
