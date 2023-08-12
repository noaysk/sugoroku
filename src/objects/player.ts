import {fetchNextCellID,fetchBeforeCellID, GOAL_CELL, START_CELL, fetchThroughEvent } from '../objects/cell'
import * as dice_ts from '../objects/dice'
import * as item_ts from '../objects/item'

export const DIRECTION_TO_GOAL = 1//ゴール方向
export const DIRECTION_TO_START = -1//スタート方向

export const MAX_PLAYER_NUMBER = 4//参加プレイヤーの最大数(変更時はplayerIconの数に注意)

//プレイヤーオブジェクトの型定義
type playerType ={
    [playerID: number]:{            //プレイヤーの識別番号
        name:string                 //プレイヤーの名前
        dice:Array<number>          //プレイヤーの所持するサイコロ
        item:Array<number>          //プレイヤーの所持するアイテム
        icon:string                 //プレイヤーアイコンのクラス名
        nextTurnPlayerID:number     //次のターンプレイヤーのID
        beforeTurnPlayerID:number   //前のターンプレイヤーのID
        condition:{                 //プレイヤーの状態
            restTurnCount:number    //プレイヤーが休み状態であるターン数
        }
        locationID:number           //プレイヤーのいるマスのcellID
    }
}
//プレイヤーオブジェクト
const player:playerType = {}

/**
 * プレイヤーオブジェクトを追加する
 * 注記(この関数はゲーム開始時に1度実行することしか想定していない)beforeTurnPlayerIDがおかしくなるため
 * @param addCount 追加したいプレイヤーの人数
 */
export const addPlayerObject=(addCount:number):void=>{
    for(let i=1;i<=addCount;i++){
        player[i] = {
            name:"",                                     //プレイヤーの名前
            dice:[dice_ts.NOMAL_DICE,dice_ts.BIG_DICE],  //プレイヤーの所持するサイコロ
            item:[],                                     //プレイヤーの所持するアイテム
            icon:"player"+`${i}`,                        //プレイヤーアイコンのクラス名
            nextTurnPlayerID:i+1,                        //次のターンプレイヤーのID
            beforeTurnPlayerID:i-1,                      //前のターンプレイヤーのID
            condition:{                                  //プレイヤーの状態
                restTurnCount:0                          //プレイヤーが休み状態であるターン数
            },
            locationID:1,                                //プレイヤーのいるマスのcellID
        }
        if(i===1)player[i].beforeTurnPlayerID = addCount
        if(i===addCount)player[i].nextTurnPlayerID = 1
    }
}

/**
 * プレイヤーオブジェクトを空にする
 */
export const emptyPlayerObj =()=>{
    for(let i = 1; i<=Object.keys(player).length;i++){
        delete player[i]
        console.log(player)
    }
}

/**
 * playerIDをもとにplayerの名前を決定する
 * @param playerName playerの名前
 * @param playerID playerの識別番号
 */
export const setPlayerName=(playerName:string,playerID:number)=>{
    player[playerID].name=playerName
}

/**
 * playerIDをもとにplayerの名前を得る
 * @param playerID playerの識別番号
 */
export const fetchPlayerName=(playerID:number):string=>{
    return player[playerID].name
}

/**
 * playerIDをもとにplayerのアイコンを得る
 * @param playerID playerの識別番号
 */
 export const fetchPlayerIcon=(playerID:number):string=>{
    return player[playerID].icon
}

/**
 * playerIDをもとにplayerのいるマスのIDを取得
 * @param playerID playerの識別番号
 */
 export const fetchLocationID=(playerID:number):number=>{
    return player[playerID].locationID
}

/**
 * プレイヤーの状態を表すクラスが付与されたアイコンを取得(プレイヤーの状態異常を増やす場合この関数も変更する)
 * @param playerID playerの識別番号
 * @returns プレイヤーの状態を表すクラスが付与されたアイコン
 */
export const getIconConsideredCondition=(playerID:number):string=>{
    if(player[playerID].condition.restTurnCount !== 0){
        console.log(player[playerID].icon + " sleep")
        return player[playerID].icon + " sleep"
    }
    return player[playerID].icon
}


//プレイヤー情報の表示に必要なデータの型定義
type playerDisplayData=Array<{
    name:string
    icon:string
    condition:{              
        restTurnCount:number   
    }
    distanceToGoal:number
}>

/**
 * 全プレイヤーの名前、状態、ゴールまでの距離を持つ配列を取得
 * @returns 全プレイヤーの名前、状態、ゴールまでの距離を持つ配列
 */
 export const getPlayerDisplayData=():playerDisplayData=>{
    const playerDisplayData:playerDisplayData = []
    for(let i=1;i<=Object.keys(player).length;i++){
        const pushObj = {
            name:player[i].name,
            icon:player[i].icon,
            condition:player[i].condition,
            distanceToGoal:getDistanceToGoal(i)
        }
        playerDisplayData.push(pushObj)
    }
    return playerDisplayData
}



//プレイヤーの所持するサイコロの表示に必要なデータの型定義
type diceDisplayData=Array<{
    ID:number
    name:string
    class:string
    description:string
}>

/**
 * プレイヤーの所持するサイコロのID,クラス名,説明文を持つ配列を取得
 * @param playerID 所持するサイコロのID,クラス名,説明文を取得したいプレイヤーのID
 * @returns プレイヤーの所持するサイコロのID,クラス名,説明文を持つ配列
 */
export const getDiceDisplayData=(playerID:number):diceDisplayData=>{
    const diceDisplayData:diceDisplayData = []
    player[playerID].dice.forEach((diceID)=>{
        const pushObj = {
            ID:diceID,
            name:dice_ts.fetchDiceName(diceID),
            class:dice_ts.fetchDiceClass(diceID),
            description:dice_ts.fetchDiceDescription(diceID)
        }
        diceDisplayData.push(pushObj)
    })
    return diceDisplayData
}



//プレイヤーの所持するアイテムの表示に必要なデータの型定義
type itemDisplayData=Array<{
    ID:number
    name:string
    class:string
    description:string
}>

/**
 * プレイヤーの所持するアイテムのID,名前,クラス名,説明文を持つ配列を取得
 * @param playerID 所持するアイテムのID,名前,クラス名,説明文を取得したいプレイヤーのID
 * @returns プレイヤーの所持するアイテムのID,名前,クラス名,説明文を持つ配列
 */
export const getItemDisplayData=(playerID:number):itemDisplayData=>{
    const itemDisplayData:itemDisplayData = []
    player[playerID].item.forEach((itemID)=>{
        const pushObj = {
            ID:itemID,
            name:item_ts.fetchItemName(itemID),
            class:item_ts.fetchItemClass(itemID),
            description:item_ts.fetchItemDescription(itemID)
        }
        itemDisplayData.push(pushObj)
    })
    return itemDisplayData
}





/**
 * playerオブジェクトの大きさを取得
 * @returns playerオブジェクトの大きさ
 */
export const getPlayerObjectSize=():number=>{
    return Object.keys(player).length
}

/**
 * プレイヤーのいるマスすべてのIDを配列で取得
 * @returns プレイヤーのいるマスすべてのIDの配列
 */
export const getLocationIDArray=():Array<number>=>{
    const locationIDArray = []
    for(let i=1;i<=Object.keys(player).length;i++){
        locationIDArray.push(player[i].locationID)
    }
    return locationIDArray
}

/**
 * playerIDをもとに次のターンプレイヤーのIDを取得
 * @param playerID playerの識別番号
 * @returns 次のターンプレイヤーの識別番号
 */
export const fetchNextTurnPlayerID=(playerID:number):number=>{
    return player[playerID].nextTurnPlayerID
}

/**
 * プレイヤーを移動させる
 * @param playerID 移動させるプレイヤーのID
 * @param direction 移動させるプレイヤーの移動方向 (DIRECTION_TO_GOAL または　DIRECTION_TO_START)
 * @param canMoveCount プレイヤーが動けるマス数
 */
 export const movePlayer=(playerID:number,direction:1|-1,canMoveCount:number):void=>{
    //動けるマス数だけターンプレイヤーを次のマス(cell.tsで指定されている)に動かす
    for(let i=0;i<canMoveCount;i++){
        if(direction === DIRECTION_TO_GOAL){
            if(moveNextCell(playerID) === 1){
                direction = DIRECTION_TO_START
            }
        }else if(direction === DIRECTION_TO_START){
            if(moveBeforeCell(playerID) === 1){
                direction = DIRECTION_TO_GOAL
            } 
        }else{
            console.log("プレイヤーを移動させる方向が間違っています")
        }
    }
}

/**
 * 指定されたplayerIDをもつplayerを次のマスに移動させる
 * (通過イベントはこの関数とmoveBeforeCellで実行)
 * @param playerID 移動させるプレイヤーのID
 */
 export const moveNextCell=(playerID:number):number=>{
    const nextCellID = fetchNextCellID(player[playerID].locationID)
    player[playerID].locationID = nextCellID

    console.log("1マス進みます")

    //マスの通過イベントを実行
    const thoughEvent = fetchThroughEvent(nextCellID)
    thoughEvent(playerID)

    //もし進んだマスがゴールマスだった場合1を返すそれ以外は0を返す
    if(nextCellID===GOAL_CELL){
        return 1
    }else{
        return 0
    }
}

/**
 * 指定されたplayerIDをもつplayerを前のマスに移動させる
 * (通過イベントはこの関数とmoveNextCellで実行)
 * @param playerID 移動させるプレイヤーのID
 */
export const moveBeforeCell=(playerID:number):number=>{
    const beforeCellID = fetchBeforeCellID(player[playerID].locationID)
    player[playerID].locationID = beforeCellID

    console.log("1マス戻ります")

    //マスの通過イベントを実行
    const thoughEvent = fetchThroughEvent(beforeCellID)
    thoughEvent(playerID)

    //もし移動したマスがスタートマスだった場合1を返すそれ以外は0を返す
    if(beforeCellID===START_CELL){
        return 1
    }else{
        return 0
    }
}

/**
 * 指定のマスにプレイヤーを飛ばす(通過イベント不実行)
 * @param playerID 移動させたいプレイヤーのID
 * @param cellID プレイヤーを移動させたいマスのID
 */
export const movePlayerSelectedCell=(playerID:number,cellID:number):void=>{
    player[playerID].locationID = cellID
}

/**
 * 指定のマスにすべてのプレイヤーを飛ばす(通過イベント不実行)
 * @param cellID すべてのプレイヤーを移動させたいマスのID
 */
 export const moveAllPlayerSelectedCell=(cellID:number):void=>{
    for(let i=1;i<=Object.keys(player).length;i++){
        player[i].locationID = cellID
    }
}

/**
 * （関数名要変更）
 * ゴールまでの距離が昇順になるよう並び替えられたプレイヤーIDの配列を取得
 * (道を分岐させる場合この関数は使用不可)
 * @returns ゴールまでの距離が昇順になるよう並び替えられたプレイヤーIDの配列
 */
export const getPlayerIDArrayOnDistance=():Array<number>=>{
    //すべてのプレイヤーIDをもつ配列を生成
    const playerIDArray = []
    for(let i=1;i<=Object.keys(player).length;i++){
        playerIDArray.push(i)
    }
    //クイックソートでゴールまでの距離が昇順になるようplayerIDArrayを並び替える
    let temporary = 0
    for(let i=0; i<playerIDArray.length-1;i++){
        for(let j=i+1; j<playerIDArray.length;j++){
            if(getDistanceToGoal(playerIDArray[i]) > getDistanceToGoal(playerIDArray[j])){
                temporary = playerIDArray[i]
                playerIDArray[i] = playerIDArray[j]
                playerIDArray[j] = temporary
            }
        }
    }
    return playerIDArray
}

/**
 * ゴールまでの距離を取得(道を分岐させる場合この関数は使用不可)
 * @param playerID ゴールまでの距離を図りたいプレイヤーのID
 */
export const getDistanceToGoal=(playerID:number):number=>{
    return GOAL_CELL-player[playerID].locationID 
}

/**
 * 指定プレイヤーが休み状態であるターン数を取得
 * @param playerID 休み状態であるターン数を確認したいプレイヤーのID
 * @returns 指定プレイヤーが休み状態であるターン数
 */
export const confirmRestTurnCount =(playerID:number):number=>{
    return player[playerID].condition.restTurnCount
}

/**
 * 指定プレイヤーを指定のターン休み状態にする
 * @param playerID 休み状態にしたいプレイヤーのID
 * @param restTurn 休み状態にしたいターン数
 */
 export const setRestState=(playerID:number,restTurn:number):void=>{
    player[playerID].condition.restTurnCount = restTurn
}

/**
 * プレイヤーが休み状態であるターン数を1減らす
 * @param playerID 休み状態のターン数を減らしたプレイヤーのID
 */
 export const decreaseRestTurnCount=(playerID:number):void=>{
    player[playerID].condition.restTurnCount--
}

/**
 * プレイヤーにサイコロを追加
 * @param playerID サイコロを追加したいプレイヤーの識別番号
 * @param diceID 追加したいサイコロの識別番号
 */
 export const addPlayerDice=(playerID:number,diceID:number):void=>{
    player[playerID].dice.push(diceID)
}

/**
 * プレイヤーのサイコロを1つ指定して削除する
 * @param playerID サイコロを削除したいプレイヤー
 * @param removeDiceID 削除したいサイコロのID
 */
export const removePlayerDice=(playerID:number,removeDiceID:number):void=>{
    player[playerID].dice.forEach((diceID,index)=>{
        if(diceID === removeDiceID){
            player[playerID].dice.splice(index,1)
            return
        }
    })
}

/**
 * プレイヤーにアイテムを追加
 * @param playerID アイテムを追加したいプレイヤーの識別番号
 * @param itemID 追加したいアイテムの識別番号
 */
export const addPlayerItem=(playerID:number,itemID:number):void=>{
    player[playerID].item.push(itemID)
}

/**
 * プレイヤーのアイテムを1つ指定して削除する
 * @param playerID アイテムを削除したいプレイヤー
 * @param removeItemID 削除したいアイテムのID
 */
export const removePlayerItem=(playerID:number,removeItemID:number):void=>{
    player[playerID].item.forEach((itemID,index)=>{
        if(itemID === removeItemID){
            player[playerID].item.splice(index,1)
            console.log(player[playerID].item)
            return
        }
    })
}

/**
 * プレイヤーのアイテムを空にする
 * @param playerID アイテムを空にしたいプレイヤーのID
 */
export const emptyPlayerItems=(playerID:number):void=>{
    player[playerID].item = []
}




// /**
//  * 引数に渡されたplayerIDを持つプレイヤーが存在するかを確認
//  * @param playerID 
//  * @returns 存在する：true 存在しない：false
//  */
//  export const confirmPlayerExestence=(playerID:number):boolean=>{
//     if(player[playerID]?.name != undefined){
//         return true
//     }else{
//         return false
//     }
// }

// /**
//  * 指定プレイヤーのターンをスキップするよう設定
//  * @param playerID スキップしたいプレイヤーのID
//  */
//  export const setPlayerSkip=(playerID:number):void=>{

//     //指定のプレイヤーの前後のターンプレイヤーのIDを取得
//     const beforeTurnPlayerID = player[playerID].beforeTurnPlayerID
//     const nextTurnPlayerID = player[playerID].nextTurnPlayerID
    
//     //指定のプレイヤーの前のターンプレイヤーのnextTurnPlayerIDに指定のプレイヤーの後のターンプレイヤーのIDを代入
//     player[beforeTurnPlayerID].nextTurnPlayerID = nextTurnPlayerID
//     //指定のプレイヤーの後のターンプレイヤーのbeforeTurnPlayerIDに指定のプレイヤーの前のターンプレイヤーのIDを代入
//     player[nextTurnPlayerID].beforeTurnPlayerID = beforeTurnPlayerID
// }

// /**
//  * 指定プレイヤーのターンをスキップされている状態を解除
//  * @param playerID スキップ状態を解除したいプレイヤーのID
//  */
// export const releasePlayerSkip=(playerID:number):void=>{
//     //指定のプレイヤーの前後のターンプレイヤーのIDを取得
//     const beforeTurnPlayerID = player[playerID].beforeTurnPlayerID
//     const nextTurnPlayerID = player[playerID].nextTurnPlayerID
    
//     //指定のプレイヤーの前のターンプレイヤーのnextTurnPlayerIDに指定のプレイヤーのIDを代入
//     player[beforeTurnPlayerID].nextTurnPlayerID = playerID
//     //指定のプレイヤーの後のターンプレイヤーのbeforeTurnPlayerIDに指定のプレイヤーのIDを代入
//     player[nextTurnPlayerID].beforeTurnPlayerID = playerID
// }
