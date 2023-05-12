// 유저 정보 (/user)

const express = require("express");
const UserService = require("../services/userService");
const { UserDTO, UpdateUserRequestDTO, DeleteUserRequestDTO } = require("../dtos/userDto");
const { InternalServerError } = require("../errors");

module.exports = () => {
  const router = express.Router();
  const userService = new UserService();

  router.get("/", async (req, res, next) => {
    try {
      const userId = req.user.id;
  
      await userService.validateUserByUserId(userId);
  
      const userInfo = await userService.findUserByUserId(userId);
  
      const user = new UserDTO(userInfo);
  
      res.json({data: user});
    } catch (error) {
      next(error);
    }
  });
  
  /**
   * @swagger
   * /api/v1/user/{id}:
   *   get:
   *     summary: 유저 정보를 ID 기반으로 반환
   *     tags: [user]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: 유저 ID
   *         required: true
   *         schema:
   *           $ref: "#/components/schemas/users/properties/id"
   *     responses:
   *       200:
   *         description: 성공.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/dtos/UserDTO'
   *       400:
   *         description: Invalid User Id.
   *       500:
   *         description: Server Error.
   */
  router.get("/:id", async (req, res, next) => {
    try {
      const userId = req.params.id;
  
      await userService.validateUserByUserId(userId);
  
      const userInfo = await userService.findUserByUserId(userId);
  
      const user = new UserDTO(userInfo);
  
      res.json({data: user});
    } catch (error) {
      next(error);
    }
  });
  /**
   * @swagger
   * /api/v1/user/{id}:
   *   put:
   *     summary: 유저 정보를 ID 기반으로 수정
   *     tags: [user]
   *     parameters:
   *       - $ref: '#/components/dtos/UpdateUserRequestDTO/parameters/pathParam'
   *     requestBody:
   *       $ref: '#/components/dtos/UpdateUserRequestDTO/requestBody'
   *     responses:
   *       200:
   *         description: 성공.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/dtos/UserDTO'
   *       400:
   *         description: Invalid User Id.
   *       500:
   *         description: Server Error.
   *
   */
  router.put("/:id", async (req, res, next) => {
    try {
        const user = new UpdateUserRequestDTO(req.params.id, req.body);

        const result = new UserDTO(resutl);

        res.json(result); 
    }catch (error) {
        next(error);
    }
  });


router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;

    const requestParam = {
      id: req.params?.id,
      body: req.body,
    }

    const user = new UpdateUserRequestDTO(userId, requestParam);

    const userInfo = await userService.updateUser(user)

    const result = new UserDTO(userInfo);

    res.json({data: result}); 
  }catch (error) {
      next(error);
  }
});

  
  /**
   * @swagger
   * /api/v1/user/{id}:
   *   delete:
   *     summary: 유저 정보를 ID 기반으로 반환
   *     tags: [user]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: 유저 ID
   *         required: true
   *         schema:
   *           $ref: "#/components/schemas/users/properties/id"
   *     responses:
   *       200:
   *         description: 성공.
   *       400:
   *         description: Invalid User Id.
   *       500:
   *         description: Server Error.
   */
  router.delete("/:id", async (req, res, next) => {
    try {
      const userId = req.user.id;
  
      const {id} = new DeleteUserRequestDTO(userId, req.params);
  
      userService.deleteUser(id);
  
      // NOTE: https://velog.io/@server30sopt/204-NOCONTENT에-대해-아시나요 
      res.status(204).end();
    } catch (error) {
        next(error);
    }
  });
  
  return router;
};
