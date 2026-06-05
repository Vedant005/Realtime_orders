import prisma from "../config/prisma.js";

export const createOrder = async (req, res) => {
  try {
    const order = await prisma.order.create({
      data: req.body,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const order = await prisma.order.update({
      where: {
        id,
      },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.order.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
