import request from '../util/request';  
// import request from 'https://08ad1pao69.execute-api.us-east-1.amazonaws.com';  
// request 是 demo 项目脚手架中提供的一个做 http 请求的方法，是对于 fetch 的封装，返回 Promise

// 错误捕获
import { message } from 'antd';

const delay = (millisecond) => {
    return new Promise((resolve) => {
        setTimeout(resolve, millisecond);
    });
};

export default {
    namespace: 'puzzlecards',
    state: {
        data: [],
        counter: 0,
    },
    effects:{
        *queryInitCards(_, sagaEffects){
            try { // 加入 try catch 捕获抛错

                const { call, put} = sagaEffects;
                // const endPointURI = 'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke';
                // const endPointURI = 'http://10.82.13.243:3005/random_joke';      
                // const endPointURI = '/random_joke';         // 使用的代理，重定向
                const endPointURI = 'dev/random_joke';         // 使用的代理，重定向
                // const endPointURI = '/amazonaws/random_joke';         // 使用的代理，重定向
                // const endPointURI = '/baidu/random_joke';         // 使用的代理，重定向
                // const endPointURI = '/404/random_joke';         // 使用的代理，重定向

                const puzzle = yield call(request, endPointURI);        // 获取服务端数据。
                yield put({ type:'addNewCard', payload: puzzle});       
                    // 添加一个卡片数据。这个会触发 reducer 的执行。于是会看到视图上添加了一个新卡片。

                yield call(delay, 3000);

                const puzzle2 = yield call(request,endPointURI);        // 第二次获取服务端数据
                yield put({ type: 'addNewCard', payload: puzzle2});     
                    // 再添加一个卡片数据。这个又会触发 reducer 的执行。于是看到第二个卡片添加到视图上去。

            } catch (e) {
                message.error('数据获取失败'); // 打印错误信息
              }
        }
    },
    reducers: {     // reducers: 用来响应 action 并修改 state
        addNewCard(state, { payload: newCard }) {
            const nextCounter = state.counter + 1;
            const newCardWithId = { ...newCard, id: nextCounter };
            const nextData = state.data.concat(newCardWithId);
            return {        // reducer 的返回值会 整个取代 (Replace) 老的 state
                data: nextData,
                counter: nextCounter,
            };
        }
    },
}