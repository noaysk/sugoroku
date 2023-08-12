import { DOUBLE_DICE, RUCKY_DICE } from './dice'
import { addPlayerItem,addPlayerDice, movePlayer, setRestState ,DIRECTION_TO_START, fetchPlayerName, movePlayerSelectedCell} from './player'
import { changeMessageText, messageText } from './sugoroku'


//特別なマスのIDを定義
export const START_CELL = 1//スタートのマス
export const GOAL_CELL = 12//ゴールのマス

//マスの情報(型定義だけにして後々変更しやすくする)
type cellType ={
    [cellID: number]:{                                //マスの識別番号
        cellText:string                               //マスに表示するテキスト
        messageText:string                            //マスに止まった時にポップアップで表示されるテキスト
        event:(playerID:number)=>void|number          //プレイヤーがこのマスに止まった時に発生するイベント
        throughEvent:(playerID:number)=>void          //プレイヤーがこのマスを通過した時に発生するイベント
        nextCellID:number                             //プレイヤーがこのマスの次に移動するマスのID
        beforeCellID:number                           //プレイヤーがこのマスに移動する前にいたマスのID
    }
}
export const cell:cellType = {
    [START_CELL]:{
        cellText:"start",
        messageText:"",
        event:()=>{},
        throughEvent:()=>{},
        nextCellID:2,
        beforeCellID:GOAL_CELL,
    },
    2:{
        cellText:"ボムを入手",
        messageText:"ボムを入手しました",
        event:(playerID:number)=>addItemBombEvent(playerID),
        throughEvent:()=>{},
        nextCellID:3,
        beforeCellID:START_CELL,
    },
    3:{
        cellText:"マグネットを入手",
        messageText:"マグネットを入手しました",
        event:(playerID:number)=>addItemMagnetEvent(playerID),
        throughEvent:()=>{},
        nextCellID:4,
        beforeCellID:2,
    },
    4:{
        cellText:"ダブルサイコロを入手",
        messageText:"ダブルサイコロを入手しました",
        event:(playerID:number)=>addDoubleDiceEvent(playerID),
        throughEvent:()=>{},
        nextCellID:5,
        beforeCellID:3,
    },
    5:{
        cellText:"サイクロンを入手",
        messageText:"サイクロンを入手しました",
        event:(playerID:number)=>addItemCycloneEvent(playerID),
        throughEvent:()=>{},
        nextCellID:6,
        beforeCellID:4,
    },
    6:{
        cellText:"罰ゲーム",
        messageText:"〇〇してください",
        event:()=>{},
        throughEvent:()=>{},
        nextCellID:7,
        beforeCellID:5,
    },
    7:{
        cellText:"１回休み",
        messageText:"プレイヤーが１回休みになりました",
        event:(playerID:number)=>givePlayerRest1Event(playerID),
        throughEvent:()=>{},
        nextCellID:8,
        beforeCellID:6,
    },
    8:{
        cellText:"ボムを入手",
        messageText:"ボムを入手しました",
        event:(playerID:number)=>addItemBombEvent(playerID),
        throughEvent:()=>{},
        nextCellID:9,
        beforeCellID:7,
    },
    9:{
        cellText:"1~3マス戻る",
        messageText:"ランダムに戻るマス数が決まります",
        event:(playerID:number)=>playerBackRandomEvent(playerID),
        throughEvent:()=>{},
        nextCellID:10,
        beforeCellID:8,
    },
    10:{
        cellText:"ランダムにアイテムを入手",
        messageText:"ランダムにアイテムを入手します",
        event:(playerID:number)=>addItemRandomEvent(playerID),
        throughEvent:()=>{},
        nextCellID:11,
        beforeCellID:9,
    },
    11:{
        cellText:"スタートに戻る",
        messageText:"スタートに戻りました",
        event:(playerID:number)=>playerFlyToStartEvent(playerID),
        throughEvent:()=>{},
        nextCellID:GOAL_CELL,
        beforeCellID:10,
    },
    [GOAL_CELL]:{
        cellText:"goal",
        messageText:"",
        event:()=>{},
        throughEvent:()=>{},
        nextCellID:START_CELL,
        beforeCellID:11,
    },
}

const cellTextAndEvent = {
    1:{
        cellText:"START",
        event:()=>{},
    },
    2:{
        cellText:"GOAL",
        event:()=>{},
    },
    3:{
        cellText:"マグネット入手",
        event:(playerID:number)=>addItemMagnetEvent(playerID),
    },
    4:{
        cellText:"サイクロン入手",
        event:(playerID:number)=>addItemCycloneEvent(playerID),
    },
    5:{
        cellText:"ボム入手",
        event:(playerID:number)=>addItemBombEvent(playerID),
    },
    6:{
        cellText:"1回休み",
        event:(playerID:number)=>givePlayerRest1Event(playerID),
    },
    7:{
        cellText:"1マス戻る",
        event:(playerID:number)=>playerBack1Event(playerID),
    },
    8:{
        cellText:"ダブルサイコロ入手",
        event:(playerID:number)=>addDoubleDiceEvent(playerID),
    },
    9:{
        cellText:"ラッキーサイコロ入手",
        event:(playerID:number)=>addRuckyDiceEvent(playerID),
    },
}

// /**
//  * マスオブジェクトを追加する
//  * 注記()
//  * @param 
//  */
//  export const addCellObject=(cellID:number,eventID:number,addCellText:string):void=>{
//     cell[cellID] = {
//         cellText:cellTextAndEvent[eventID].cellText,                    //マスに表示するテキスト
//         event:cellTextAndEvent[eventID].event,      //プレイヤーがこのマスに止まった時に発生するイベント
//         nextCellID:i+1,                  //プレイヤーがこのマスの次に移動するマスのID
//         beforeCellID:i-1                //プレイヤーがこのマスに移動する前にいたマスのID
//     }
// }

// /**
//  * 各マスの表示テキストを配列で取得
//  * @returns 
//  */
// export const getCellTextArray=()=>{
//     const cellTextArray = []
//     for(let i=1;i<=Object.keys(cell).length;i++){
//         cellTextArray.push(cell[i].cellText)
//     }

//     return cellTextArray
// }

/**
 * cellIDよりnextCellIDを取得
 * @param cellID 
 * @returns 次のマスのID
 */
export const fetchNextCellID=(cellID:number):number=>{
    return cell[cellID].nextCellID
}

/**
 * cellIDよりbeforeCellIDを取得
 * @param cellID 
 * @returns 前のマスのID
 */
export const fetchBeforeCellID=(cellID:number):number=>{
    return cell[cellID].beforeCellID
}

/**
 * ポップアップに表示するテキストを取り出す
 * @param cellID 
 * @returns メッセージテキスト
 */
export const fetchMessageText=(cellID:number):string=>{
    return cell[cellID].messageText
}

/**
 * マスのイベントを取り出す
 * @param cellID イベントを取り出したいマスのID
 * @returns マスのイベント
 */
export const fetchCellEvent=(cellID:number):(playerID:number)=>void|number=>{
    return cell[cellID].event
}

/**
 * マスの通過イベントを取り出す
 * @param cellID 通過イベントを取り出したいマスのID
 * @returns マスの通過イベント
 */
export const fetchThroughEvent=(cellID:number):(playerID:number)=>void|number=>{
    return cell[cellID].throughEvent
}



const playerFlyToStartEvent=(playerID:number)=>{
    movePlayerSelectedCell(playerID,START_CELL)
}

/**
 * プレイヤーを引数のbackCountだけスタート方向に移動させるイベント
 * @param playerID スタート方向に移動させたいプレイヤーのID
 * @param backCount プレイヤーを移動させたいマス数
 */
 const playerBackEvent=(playerID:number,backCount:number):void=>{
    movePlayer(playerID,DIRECTION_TO_START,backCount)
    changeMessageText(`${backCount}マス戻ります`)
}

/**
 * プレイヤーをスタート方向に1移動させるイベント
 * @param playerID スタート方向に移動させたいプレイヤーのID
 * @param backCount プレイヤーを移動させたいマス数
 */
const playerBack1Event=(playerID:number):void=>{
    playerBackEvent(playerID,1)
}

/**
 * プレイヤーをスタート方向に2移動させるイベント
 * @param playerID スタート方向に移動させたいプレイヤーのID
 * @param backCount プレイヤーを移動させたいマス数
 */
 const playerBack2Event=(playerID:number):void=>{
    playerBackEvent(playerID,2)
}

/**
 * プレイヤーをスタート方向に3移動させるイベント
 * @param playerID スタート方向に移動させたいプレイヤーのID
 * @param backCount プレイヤーを移動させたいマス数
 */
 const playerBack3Event=(playerID:number):void=>{
    playerBackEvent(playerID,3)
}

/**
 * プレイヤーをランダムなマス数スタート方向に移動させるイベント
 * @param playerID スタート方向に移動させるプレイヤーのID
 */
 const playerBackRandomEvent=(playerID:number):number=>{
    const eventArray = [playerBack1Event,playerBack2Event,playerBack3Event]
    const selectedEvent = selectEventRandomly(eventArray)
    selectedEvent(playerID)
    return -1
}

/**
 * プレイヤーを指定のターン休みにするイベント
 * @param playerID 休みにしたいプレイヤーのID
 * @param restCount 休みにしたいターン数
 */
 const givePlayerRestEvent=(playerID:number,restCount:number):void=>{
    setRestState(playerID,restCount)
    changeMessageText(`プレイヤーが${restCount}回休みになりました`)
}

/**
 * プレイヤーを1回休みにするイベント
 * @param playerID 1回休みにしたいプレイヤーのID
 */
const givePlayerRest1Event=(playerID:number):void=>{
    givePlayerRestEvent(playerID,1)
}

/**
 * プレイヤーを2回休みにするイベント
 * @param playerID 1回休みにしたいプレイヤーのID
 */
 const givePlayerRest2Event=(playerID:number):void=>{
    givePlayerRestEvent(playerID,2)
}

/**
 * プレイヤーを3回休みにするイベント
 * @param playerID 1回休みにしたいプレイヤーのID
 */
 const givePlayerRest3Event=(playerID:number):void=>{
    givePlayerRestEvent(playerID,3)
}

/**
 * プレイヤーをランダムなターン数休み状態にする
 * @param playerID 休み状態になるプレイヤーのID
 */
 const randomTurnRestEvent=(playerID:number):number=>{
    const eventArray = [givePlayerRest1Event,givePlayerRest2Event,givePlayerRest3Event]
    const selectedEvent = selectEventRandomly(eventArray)
    selectedEvent(playerID)
    return -1
}


/**
 * マグネット入手イベント
 * @param playerID アイテムを追加したいプレイヤーの識別番号
 * @param itemID 追加したいアイテムの識別番号
 */
 const addItemMagnetEvent=(playerID:number):void=>{
    addPlayerItem(playerID,1)
    changeMessageText("マグネットを入手しました")
}

/**
 * サイクロン入手イベント
 * @param playerID アイテムを追加したいプレイヤーの識別番号
 * @param itemID 追加したいアイテムの識別番号
 */
const addItemCycloneEvent=(playerID:number):void=>{
    addPlayerItem(playerID,2)
    changeMessageText("サイクロンを入手しました")
}

/**
 * ボム入手イベント
 * @param playerID アイテムを追加したいプレイヤーの識別番号
 * @param itemID 追加したいアイテムの識別番号
 */
 const addItemBombEvent=(playerID:number):void=>{
    addPlayerItem(playerID,3)
    changeMessageText("ボムを入手しました")
}

/**
 * ランダムにアイテムを入手するイベント
 * @param playerID アイテムを入手するプレイヤーのID
 */
 const addItemRandomEvent=(playerID:number):number=>{
    const eventArray = [addItemBombEvent,addItemCycloneEvent,addItemMagnetEvent]
    const selectedEvent = selectEventRandomly(eventArray)
    selectedEvent(playerID)
    return -1
}

/**
 * ダブルサイコロ入手イベント
 * @param playerID ダブルサイコロを入手させたいプレイヤーのID
 */
const addDoubleDiceEvent=(playerID:number):void=>{
    addPlayerDice(playerID,DOUBLE_DICE)
}

/**
 * ラッキーサイコロ入手イベント
 * @param playerID ラッキーサイコロを入手させたいプレイヤーのID
 */
const addRuckyDiceEvent=(playerID:number):void=>{
    addPlayerDice(playerID,RUCKY_DICE)
}

/**
 * 何らか命令文を表示するイベント
 * @param playerID 命令を受けるプレイヤー
 */
const displayFreeOrderEvent=(playerID:number):void=>{
    const playerName = fetchPlayerName(playerID)
}

/**
 * イベントを複数もつ配列の中からランダムにイベントを返す
 * @param eventArray イベントを複数もつ配列
 * @returns ランダムに選択されたイベント
 */
const selectEventRandomly=(eventArray:Array<(playerID:number)=>void>):(playerID:number)=>void=>{

    //eventArray配列の長さ-1
    const length = eventArray.length - 1

    //0~lengthの数値をランダムで生成
    const randomIndex = Math.floor(Math.random()*(length+1))

    //引数のイベントの中からランダムにイベントを返す
    return eventArray[randomIndex]
}

