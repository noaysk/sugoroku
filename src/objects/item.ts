import {fetchLocationID,moveAllPlayerSelectedCell, movePlayerSelectedCell,emptyPlayerItems,getPlayerObjectSize, fetchPlayerName} from './player'
import { START_CELL } from '../objects/cell'

//アイテムの種類を定義
export const MAGNET = 1//マグネット
export const CYCLONE = 2//サイクロン
export const BOMB = 3//ボム
export const MagicHand = 4//マジックハンド
/**
 * ■アイテムの種類を追加する場合はアイテム種類IDを定義する。
 */

//アイテムの情報(型定義だけにして後々変更しやすくする)
type itemType ={
    [itemID: number]:{                                     //アイテムの識別番号
        name:string                                        //アイテムの名前
        event:(playerID:number,targetID:number)=>void      //アイテム使用時のイベント
        class:string                                       //アイテムにつけるクラス名
        description:string                                 //アイテムの説明
    }
}
const item:itemType={
    [MAGNET]:{
        name:"マグネット",
        event:(playerID,targetID)=>{useMagnetEvent(playerID,targetID)},
        class:"magnet",
        description:"指定したプレイヤーを自分のマスに移動させる"
    },
    [CYCLONE]:{
        name:"サイクロン",
        event:(playerID,targetID)=>{useCycloneEvent(playerID,targetID)},
        class:"cyclone",
        description:"自分自身と指定したプレイヤーをスタートマスに移動させる"
    },
    [BOMB]:{
        name:"ボム",
        event:(playerID,targetID)=>{useBombEvent(playerID,targetID)},
        class:"bomb",
        description:"指定したプレイヤーのアイテムをすべて破壊する"
    },
    /**
     * ■アイテムの種類を追加する場合はここに定義する。
     * ・名前
     * ・処理内容
     * ・クラス名
     * ・画面に表示する説明文
     */
}

// const itemEvents = {
//     1:(playerID:number)=>{useMagnetEvent(playerID)},
//     2:(playerID:number)=>{useCycloneEvent(playerID)},
//     3:(playerID:number)=>{useBombEvent(playerID)}
// }

// const itemImages = {

// }

// /**
//  * アイテムオブジェクトを追加する
//  * @param 
//  */
//  const addItemObject=(itemID:number,name:string,eventID:number,):void=>{
//     item[itemID] = {                     //アイテムの識別番号
//             name:name,                        //アイテムの名前
//             event:itemEvents[number]      //アイテム使用時のイベント
//             class:string                         //アイテムの画像のパス
//             description:string                 //アイテムの説明
//         }
//     }
// }


/**
 * アイテムにつけるクラス名を取り出す
 * @param itemID クラス名を取り出したいアイテムのID
 * @returns アイテムにつけるクラス名
 */
export const fetchItemClass=(itemID:number):string=>{
    return item[itemID].class
}

/**
 * アイテムの名前を取り出す
 * @param itemID 名前を取り出したいアイテムのID
 * @returns アイテムの名前
 */
export const fetchItemName=(itemID:number):string=>{
    return item[itemID].name
}

/**
 * アイテムの説明を取り出す
 * @param itemID 説明を取り出したいアイテムのID
 * @returns アイテムの説明
 */
 export const fetchItemDescription=(itemID:number):string=>{
    return item[itemID].description
}

/**
 * アイテムイベントを取り出す
 * @param itemID イベントを取り出したいアイテムのID
 * @returns アイテムイベント
 */
export const fetchItemEvent=(itemID:number):(playerID:number,targetID:number)=>void=>{
    return item[itemID].event
}






/**
 * マグネット使用イベント
 * @param playerID マグネットを使用したプレイヤーのID
 * @param targetID 対象のプレイヤーID
 */
const useMagnetEvent=(playerID:number,targetID:number):void=>{
    alert(`${fetchPlayerName(targetID)}を自分のマスに飛ばしました`)
    const usePlayerCellID = fetchLocationID(playerID)//アイテムを使用したプレイヤーのいるマス
    //対象のプレイヤーをアイテムを使用したプレイヤーのいるマスに移動
    movePlayerSelectedCell(targetID,usePlayerCellID)
}

/**
 * サイクロン使用イベント
 * @param playerID サイクロンを使用したプレイヤーのID
 * @param targetID 対象のプレイヤーID
 */
 const useCycloneEvent=(playerID:number,targetID:number):void=>{
    alert(`${fetchPlayerName(targetID)}と${fetchPlayerName(playerID)}をスタートマスに飛ばしました`)
    //サイクロンを使用したプレイヤーと対象のプレイヤーをスタートマスに移動
    movePlayerSelectedCell(targetID,START_CELL)
    movePlayerSelectedCell(playerID,START_CELL)
}

/**
 * ボム使用イベント
 * @param playerID ボムを使用したプレイヤーのID
 * @param targetID 対象のプレイヤーID
 */
const useBombEvent=(playerID:number,targetID:number):void=>{
    alert(`${fetchPlayerName(targetID)}のアイテムを破壊しました`)
    for(let i=1;i<=getPlayerObjectSize();i++){
        if(i === targetID)emptyPlayerItems(i)
    }
}

/**
 * ミニボム使用イベント
 * @param playerID ミニボムを使用したプレイヤーのID
 * @param targetID 対象のプレイヤーID
 */
 const useMiniBombEvent=(playerID:number,targetID:number):void=>{
    alert(`${fetchPlayerName(targetID)}のアイテムを破壊しました`)
    for(let i=1;i<=getPlayerObjectSize();i++){
        if(i === targetID)emptyPlayerItems(i)
    }
}

/**
 * ■アイテム処理を追加する場合はここに定義する。
 */


