const state = {
    token: localStorage.getItem('token') || ''
}
const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
        // 将token存储到localStorage中，实现页面刷新后保持登录状态
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    }
}
const actions = {
    // 模拟登录
    async login({ commit }, loginForm) {
        const { username, password } = loginForm
        if (!username || !password) {
            throw new Error('用户名或密码不能为空')
        }
        // 模拟登录
        const token = '123456'
        commit('SET_TOKEN', token)
        return token
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}