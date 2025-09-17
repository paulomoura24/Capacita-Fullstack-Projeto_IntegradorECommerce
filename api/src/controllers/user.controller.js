import * as userService from '../services/user.service.js';

export async function me(req, res) {
  const user = await userService.getMe(req.user.sub);
  res.json({ user });
}


export async function list(req, res) {
  const users = await userService.listUsers();
  res.json({ users });
}