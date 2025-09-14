import * as userService from '../services/user.service.js';

export async function me(req, res) {
  const user = await userService.getMe(req.user.sub);
  res.json({ user });
}
