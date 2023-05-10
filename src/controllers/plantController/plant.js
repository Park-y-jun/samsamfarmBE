const express = require("express");
const knex = require("../../config/knexClient");

const { CreatePlantRequestDTO } = require("../plantController/../../dtos/plantDto");

const router = express.Router();

  /**
   * @swagger
   * /api/plant:
   *   post:
   *     summary: 새로운 작물 생성(배정)
   *     tags: [plant]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/plants'
   *     parameters:
   *       - name: plant_type
   *         in: query
   *         required: true
   *         description: 작물 품종 이름
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: 작물 생성 성공.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/plants'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
router.post("/", (req, res, next) => {
  try {
    const { user_id, device_id, plant_type } = new CreatePlantRequestDTO(
      req.body
    );
    knex("plants")
      .insert({
        user_id,
        device_id,
        plant_type,
      })
      .then(() => {
        res.status(201).json({ message: "Plant created" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Failed to create plant" });
      });
  } catch (err) {
    if (err instanceof BadRequest) {
      res.status(400).json({ error: err.message });
    } else {
      next(err);
    }
  }
});

   /**
   * @swagger
   * /api/plant/:user_id:
   *   get:
   *     summary: 특정 유저의 작물 성장 단계 조회
   *     tags: [plant]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/plant_grade_with_user'
   *     parameters:
   *       - name: user-id
   *         in: query
   *         required: true
   *         description: 유저의 고유 id
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: Success.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/plant_grade_with_user'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
router.get("/:user_id", async (req, res, next) => {
    try {
      const userId = req.params.user_id;
      const userPlants = await knex("plants").where("user_id", userId);
      res.status(200).json(userPlants);
    } catch (err) {
      if (err instanceof BadRequest) {
      } else {
        next(err);
      }
    }
  });

 

  /**
   * @swagger
   * /api/plant/:
   *   get:
   *     summary: 전체 유저의 작물 성장 단계 조회
   *     tags: [plant]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/plant_grade_with_user'
   *     responses:
   *       200:
   *         description: Success.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/plant_grade_with_user'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
router.get("/", async (req, res, next) => {
   try {
    const userPlants = await knex
      .select("*")
      .from("plants");
      res.status(200).json(userPlants);
   } catch (err) {
     if (err instanceof BadRequest) {
     } else {
       next(err);
     }
   }
  });
  
module.exports = router;
