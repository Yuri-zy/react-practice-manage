import { makeAutoObservable, runInAction } from "mobx"
import { http } from "@/utils"

class UserStore {
    userInfo = {}
    constructor() {
        makeAutoObservable(this)
    }
    getUserInfo = async () => {
        // 调用接口获取数据
        const res = await http.get('/user/profile')
        // Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed.
        runInAction(() => {
            this.userInfo = res.data
        })

    }
}

export default UserStore