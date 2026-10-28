import mongoose from "mongoose";
import FakultasModel from "../model/Fakultas.model.js";
import ProdiModel from "../model/Prodi.model.js";
import { StoreProdiSchema, UpdateProdiSchema } from "../schemas/prodi.schema.js";
import { apiResponse, apiResponseValidation } from "../utils/response.js";

class ProdiController {
  static async index(req, res) {
  const {
    search,
    sortBy = "createdAt",
    sort = "desc",
    page = 1,
    limit = 10,
  } = req.query;

  // Pagination
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const perPage = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (currentPage - 1) * perPage;

  // Filter
  const filter = {};

  if (search) {
    filter.nama_prodi = {
      $regex: search,
      $options: "i",
    };
  }

  // Sorting
  const allowedSortFields = ["kode", "nama_prodi", "createdAt", "updatedAt"];

  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const sortOption = {
    [sortField]: sort === "desc" ? -1 : 1,
    _id: 1,
  };

  // Query data + total
  const [listProdi, totalData] = await Promise.all([
    ProdiModel.find(filter)
      .select({
        _id: 1,
        kode: 1,
        nama_prodi: 1,
        fakultas: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort(sortOption)
      .skip(skip)
      .limit(perPage)
      .populate({ path: "fakultas", select: "name" }),

    ProdiModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalData / perPage);

  return apiResponse({
    res,
    status: 200,
    message: "List prodi",
    data: {
      items: listProdi,
      pagination: {
        totalData,
        totalPages,
        currentPage,
        perPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    },
  });
}

  static async show(req, res) {
    const prodiId = req.params.id;
    const prodi = await ProdiModel.findById(prodiId).populate('fakultas');

    if (!prodi) {
      return apiResponse({ res, status: 404, message: "Prodi tidak ada", data: null });
    }

    return apiResponse({ res, status: 200, message: "Detail prodi", data : prodi });
  }

  static async store(req, res) {
    const result = StoreProdiSchema.safeParse(req.body);

    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error });
    }

    const { kode, nama_prodi, fakultas_id } = result.data;

    const isExists = await FakultasModel.exists({
      _id: new mongoose.Types.ObjectId(fakultas_id),
    });

    if (!isExists) {
      return apiResponse({ res, status: 404, message: "Fakultas tidak ada", data: null });
    }

    const newProdi = await ProdiModel.create({
      kode,
      nama_prodi,
      fakultas: fakultas_id,
    });

    return apiResponse({ res, status: 201, message: "Prodi berhasil di buat", data: newProdi });
  }

  static async update(req, res) {
    const prodiId = req.params.id;
    const result = UpdateProdiSchema.safeParse(req.body);

    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error });
    }

    const prodi = await ProdiModel.findById(prodiId);
    if (!prodi) {
      return apiResponse({ res, status: 404, message: "Prodi tidak ada", data: null });
    }

    const { kode, nama_prodi, fakultas_id } = result.data;

    if (fakultas_id) {
      const isExists = await FakultasModel.exists({
        _id: new mongoose.Types.ObjectId(fakultas_id),
      });

      if (!isExists) {
        return apiResponse({ res, status: 404, message: "Fakultas tidak ada", data: null });
      }
    }

    const updatedProdi = await ProdiModel.findByIdAndUpdate(
      prodiId,
      { kode, nama_prodi, fakultas: fakultas_id },
      { new: true }
    ).populate("fakultas");

    return apiResponse({ res, status: 200, message: "Prodi berhasil diperbarui", data: updatedProdi });
  }

  static async delete(req, res) {
    const prodiId = req.params.id;
    const prodi = await ProdiModel.findById(prodiId);

    if (!prodi) {
      return apiResponse({ res, status: 404, message: "Prodi tidak ada", data: null });
    }

    await ProdiModel.findByIdAndDelete(prodiId);
    return apiResponse({ res, status: 200, message: "Prodi berhasil dihapus", data: null });
  }
}

export default ProdiController;