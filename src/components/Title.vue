<template>
    <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../style.css" media="all" />

    <title>title</title>
  </head>
  <body  @click="onClickTitle">
    <div class="container">
      <img src="../../images/screenImages/Top.png" alt="" />
      <button>Press Enter</button>
    </div>
  </body>
</template>

<script setup  lang="ts">
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const onClickTitle=()=>{
        router.push("/Menu")
    }

    document.addEventListener("keypress", keypress_event);

    function keypress_event(e:any) {
    if (e.code === "Enter") {
        //Enterキーが押された時の処理
        router.push("/Menu")
    }
    return false;
    }
    
</script>

<style scoped>
    .container {
    position: relative;
    }
    img {
    display: block;
    margin: auto;
    height: 800px;
    }
    button {
    position: absolute;
    background: transparent;
    border: 2px solid transparent;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 45px;
    font-weight: 700;
    color: rgb(73, 46, 124);
    }
    button:hover {
    font-size: 55px;
    cursor: pointer;
    }
</style>