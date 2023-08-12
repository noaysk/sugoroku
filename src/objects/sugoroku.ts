import * as player_ts from './player'
import * as dice_ts from './dice'
import { GOAL_CELL,fetchCellEvent, fetchMessageText} from './cell'
import { fetchItemEvent } from './item'

//すごろくのターン
let turnCount = 1

//ターンプレイヤーのplayerID
export let turnPlayerID = 1

//メッセージダイアログに表示するテキスト
export let messageText = ""

/**
 * サイコロ使用処理
 * @param selectedDice プレイヤーが選択したサイコロのID
 * @returns 勝者が決定した場合: true  勝者が決定していない場合：false
 */
export const dealWithRollingDice=(selectedDice:number):boolean=>{

    //ターンプレイヤーが何マス動けるかを取得
    const canMoveCount = dice_ts.rollDice(selectedDice)
    alert(`${canMoveCount}が出ました`)

    console.log(`${canMoveCount}マス動きます`)
    
    //動けるマス数だけターンプレイヤーを移動
    player_ts.movePlayer(turnPlayerID, player_ts.DIRECTION_TO_GOAL, canMoveCount)

    //ポップアップ表示するテキストを変更
    messageText = (fetchMessageText(player_ts.fetchLocationID(turnPlayerID)))

    //使用したサイコロが常時使えるサイコロではない場合ターンプレイヤーの所持サイコロから消去する
    if(selectedDice !== dice_ts.NOMAL_DICE && selectedDice !== dice_ts.BIG_DICE){
        player_ts.removePlayerDice(turnPlayerID,selectedDice)
    }

    //ターンプレイヤーがゴールしているかの確認
    if(findFinisher()){
        return true
    }else{
        return false
    }
}

/**
 * アイテム使用イベント処理
 * @param selectedItem プレイヤーが選択したアイテムのID
 */
export const dealWithUsingItem=(selectedItem:number,targetID:number):void=>{

    console.log(`${selectedItem}`)

    //ターンプレイヤーが使用したアイテムのイベントを発火
    const itemEvent = fetchItemEvent(selectedItem)
    itemEvent(turnPlayerID,targetID)

    //使用したアイテムをターンプレイヤーの所持アイテムから消去する
    player_ts.removePlayerItem(turnPlayerID,selectedItem)
}


/**
 * マスイベントを実行
 */
export const excuteCellEvent=():boolean=>{
    //ターンプレイヤーが移動したマスのイベントを発火
    console.log(`動いた後のマス：${player_ts.fetchLocationID(turnPlayerID)}`)
    const cellEvent = fetchCellEvent(player_ts.fetchLocationID(turnPlayerID))
    if(cellEvent(turnPlayerID) === -1){
        return true
    }
    return false
}


//ターン終了処理
export const endOfTurn=():void=>{
    //ターン数を1増やす
    turnCount++

    //次のターンプレイヤーのIDを取得
    const nextTurnPlayerID = player_ts.fetchNextTurnPlayerID(turnPlayerID)

    //ターンプレイヤーのIDを次のターンプレイヤーのIDに変更
    turnPlayerID = nextTurnPlayerID
    console.log(`次のプレイヤーのターンID：${turnPlayerID}`)
}


//ターン開始処理
export const startOfTurn=():void=>{

    //プレイヤーが休み状態の場合、ターンをスキップする
    if(player_ts.confirmRestTurnCount(turnPlayerID)!=0){
        
        alert(`${player_ts.fetchPlayerName(turnPlayerID)}は休み状態です`)

        //プレイヤーの休み状態のカウントを1減らす
        player_ts.decreaseRestTurnCount(turnPlayerID)

        //ターンプレイヤーのIDを次のターンプレイヤーのIDに変更
        turnPlayerID = player_ts.fetchNextTurnPlayerID(turnPlayerID)

        //再帰処理でさらに次のターンのプレイヤーがターンを開始できるか確認する
        startOfTurn()
    }
}

/**
 * ターンプレイヤーがゴールしたか確認
 * @return ゴールしていた場合：true ゴールしていなかった場合：false
 */
const findFinisher=():boolean=>{
    if(player_ts.fetchLocationID(turnPlayerID) === GOAL_CELL){
        return true
    }else{
        return false
    }
}

type rankingType =Array<{
    name:string     //プレイヤーの名前
    icon:string     //プレイヤーアイコンのパス
    rank:number     //プレイヤーの順位
    distance:number //プレイヤーのゴールまでの距離
}>
/**
 * 順位を持った配列を生成
 */
export const judgeTheRanking=():rankingType=>{
    //この配列が[1位のプレイヤーID,2位のプレイヤーID,3位のプレイヤーID,4位のプレイヤーID,]となる
    const ArrayOnDistance = player_ts.getPlayerIDArrayOnDistance()
    const rankingArray:rankingType = []
    let   ranking:number = 1;
    let   Distance:number = 0;
    
    for(let i=0;i<player_ts.getPlayerObjectSize();i++){
        // 上位の人とゴールまでの距離が同じ(同率順位)であれば、順位とゴールまでの距離の更新をしない
        if(!(Distance == player_ts.getDistanceToGoal(ArrayOnDistance[i]))){
            ranking = i + 1;
            Distance = player_ts.getDistanceToGoal(ArrayOnDistance[i]);
        }
        const pushObj = {
            name:player_ts.fetchPlayerName(ArrayOnDistance[i]),
            icon:player_ts.fetchPlayerIcon(ArrayOnDistance[i]),
            rank:ranking,
            distance:Distance,
        }
        rankingArray.push(pushObj)
    }
    return rankingArray
}

/**
 * メッセージテキストを変更
 * @param text 
 */
export const changeMessageText =(text:string):void=>{
    messageText = text
}


/**
 * 複数のプレイヤーに同じイベントを実行
 * @param playerIDArray イベントを実行したいプレイヤーのIDを持つ配列
 * @param event 実行したいイベント
 */
export const excuteEventEachPlayer=(playerIDArray:Array<number>,event:(playerID:number)=>void):void=>{
    playerIDArray.forEach((playerID)=>{
        event(playerID)
    })
}
