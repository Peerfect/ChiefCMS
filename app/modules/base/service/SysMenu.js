import { Service } from "chanjs";

class SysMenuService extends Service {
  constructor() {
    super("sys_menu");
  }

  // 获取角色关联的所有菜单ID，包括所有层级的父级菜单
  async getAllMenuIdsWithParents(roleIds) {
    try {
      if (!roleIds || roleIds.length === 0) {
        return [];
      }

      // 步骤1: 获取角色直接关联的菜单ID
      const directMenus = await this.db("sys_role_menu")
        .select("menu_id")
        .whereIn("role_id", roleIds);

      if (!directMenus || directMenus.length === 0) {
        return [];
      }

      let allMenuIds = [...new Set(directMenus.map((menu) => menu.menu_id))];

      // 步骤2: 循环获取所有父级菜单ID
      while (true) {
        // 获取当前所有菜单ID对应的父级ID
        const parentMenus = await this.db("sys_menu")
          .select("pid")
          .whereIn("id", allMenuIds)
          .where("pid", "!=", 0); // 排除根节点

        if (!parentMenus || parentMenus.length === 0) {
          break;
        }

        const parentIds = [...new Set(parentMenus.map((menu) => menu.pid))];

        // 筛选出不在已有菜单ID列表中的父级ID
        const newParentIds = parentIds.filter((pid) => !allMenuIds.includes(pid));

        // 如果没有新的父级ID，退出循环
        if (newParentIds.length === 0) {
          break;
        }

        // 将新的父级ID添加到菜单ID列表中
        allMenuIds = [...allMenuIds, ...newParentIds];
      }

      return allMenuIds;
    } catch (error) {
      console.error('[SysMenu.getAllMenuIdsWithParents] 查询菜单ID时出错:', error.message);
      return [];
    }
  }

  async allRouter(userId) {
    try {
      const roles = await this.db("sys_user_role")
        .select("role_id")
        .where("user_id", userId);

      if (!roles || roles.length === 0) {
        return { success: true, code: 200, msg: '查询成功', data: { perms: [], routers: [] } };
      }

      const roleIds = roles.map((role) => role.role_id);

      const allMenuIds = await this.getAllMenuIdsWithParents(roleIds);

      if (!allMenuIds || allMenuIds.length === 0) {
        return { success: true, code: 200, msg: '查询成功', data: { perms: [], routers: [] } };
      }

      let menuDetails = await this.db("sys_menu")
        .whereIn("id", allMenuIds)
        .select([
          "id",
          "pid",
          "title",
          "name",
          "path",
          "component",
          "icon",
          "perms",
          "type",
          "is_show",
        ])
        .whereNot("type", "F")
        .orderBy("order_num", "asc");

      if (!menuDetails || !Array.isArray(menuDetails)) {
        menuDetails = [];
      }

      const perms = menuDetails
        .filter((menu) => menu.perms)
        .map((menu) => menu.perms);

      return { success: true, code: 200, msg: '查询成功', data: { perms, routers: menuDetails } };
    } catch (error) {
      console.error(`[SysMenu.allRouter] 查询用户 ${userId} 的菜单时出错:`, error.message);
      return { success: false, code: 500, msg: '查询失败', data: { perms: [], routers: [] } };
    }
  }

  async allPerms(userId) {
    try {
      // Step 1: 根据 user_id 查找 role_id
      const roles = await this.db("sys_user_role")
        .select("role_id")
        .where("user_id", userId);

      if (!roles || roles.length === 0) {
        return { success: true, code: 200, msg: '查询成功', data: [] };
      }

      const roleId = roles.map((role) => role.role_id);

      // Step 2: 根据 role_id 查找 menu_id
      const menus = await this.db("sys_role_menu")
        .select("menu_id")
        .whereIn("role_id", roleId);

      if (!menus || menus.length === 0) {
        return { success: true, code: 200, msg: '查询成功', data: [] };
      }

      const menuIds = menus.map((menu) => menu.menu_id);

      // Step 3: 根据 menu_id 查找具体的菜单perms信息
      const res = await this.db("sys_menu")
        .whereIn("id", menuIds)
        .select(["perms"]);
      
      if (!res || !Array.isArray(res)) {
        return { success: true, code: 200, msg: '查询成功', data: [] };
      }
      
      return { success: true, code: 200, msg: '查询成功', data: res };
    } catch (error) {
      console.error(`[SysMenu.allPerms] 查询用户 ${userId} 的权限时出错:`, error.message);
      return { success: false, code: 500, msg: '查询失败', data: [] };
    }
  }

  /**
   * @description 根据菜单ID查找菜单信息
   * @param {number} id - 菜单ID
   * @returns {Promise<Object>} 返回标准格式的查询结果
   */
  async detail(id) {
    const res = await this.findById(id);
    return res;
  }

  /**
   * @description 删除菜单
   * @param {number} id - 要删除的菜单ID
   * @returns {Promise<Object>} 返回标准格式的删除结果
   */
  async delete(id) {
    const res = await this.deleteById(id);
    return res;
  }

  /**
   * @description 获取分页菜单列表
   * @param {Object} options - 分页查询参数
   * @returns {Promise<Object>} 返回标准格式的查询结果
   */
  async list(query) {
    const res = await this.query({
      current: 1,
      pageSize: this.limit,
      query,
      fields: [
        "id",
        "name",
        "pid",
        "order_num",
        "path",
        "component",
        "title",
        "is_frame",
        "is_show",
        "perms",
        "icon",
        "type",
      ],
      sort: { order_num: "asc" },
    });
    return res;
  }

  // 增
  async create(body) {
    const res = await this.insert(body);
    return res;
  }

  //改
  async update(body) {
    const { id, ...data } = body;
    const res = await this.updateById(id, data);
    return res;
  }
}

export default new SysMenuService();
