//サイコロの種類を定義
export const NOMAL_DICE = 1//通常サイコロ[常時使える]
export const BIG_DICE = 2//大振りサイコロ[常時使える]
export const DOUBLE_DICE = 3//ダブルサイコロ
export const ODD_DICE = 4//奇数サイコロ
export const RUCKY_DICE = 5//ラッキーサイコロ
/**
 * ■サイコロの種類を追加する場合はサイコロ種類IDを定義する。
 */

//サイコロの情報(型定義だけにして後々変更しやすくする)
type diceType ={
    [diceID: number]:{            //サイコロの識別番号
        name:string               //サイコロの名前
        diceNumber:Array<number>  //サイコロの目
        class:string              //サイコロにつけるクラス名
        description:string        //サイコロの説明
    }
}
const dice:diceType={
    [NOMAL_DICE]:{
        name:"通常サイコロ",
        diceNumber:[1,2,3,4,5,6],
        class:"nomalDice",
        description:"1 ~ 6の目がでる"
    },
    [BIG_DICE]:{
        name:"大振りサイコロ",
        diceNumber:[0,1,2,3,4,5,6,7],
        class:"bigDice",
        description:"0 ~ 7の目がでる"
    },
    [DOUBLE_DICE]:{
        name:"*ダブルサイコロ",
        diceNumber:[2,3,4,5,6,7,8,9,10,11,12],
        class:"doubleDice",
        description:"2 ~ 12の目がでる"
    },
    [ODD_DICE]:{
        name:"*奇数サイコロ",
        diceNumber:[1,3,5],
        class:"奇数サイコロにつけるクラス名",
        description:"1 か 3 か 5 のいずれかがでる"
    },
    /**
     * ■サイコロの種類を追加する場合はここに定義する。
     * ・名前
     * ・出目配列
     * ・クラス名
     * ・画面に表示する説明文
     */
}

/**
 * サイコロにつけるクラスを取り出す
 * @param diceID　サイコロにつけるクラスを取り出したいサイコロのID
 * @returns サイコロにつけるクラス
 */
 export const fetchDiceClass=(diceID:number):string=>{
    return dice[diceID].class
}

/**
 * サイコロの名前を取り出す
 * @param diceID サイコロの名前を取り出したいサイコロのID
 * @returns サイコロの名前
 */
export const fetchDiceName=(diceID:number):string=>{
    return dice[diceID].name
}

/**
 * サイコロの説明を取り出す
 * @param diceID 説明を取り出したいサイコロのID
 * @returns サイコロの説明
 */
 export const fetchDiceDescription=(diceID:number):string=>{
    return dice[diceID].description
}

/**
 * サイコロの種類をもとに乱数を生成する
 * @param diceID サイコロの種類
 * @returns 
 */
export const rollDice=(diceID:number)=>{
    //diceNumber配列の長さ-1
    const length = dice[diceID].diceNumber.length - 1
    //0~lengthの数値をランダムで生成
    const randomIndex = Math.floor(Math.random()*(length+1))

    return dice[diceID].diceNumber[randomIndex]
}