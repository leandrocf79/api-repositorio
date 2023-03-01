import {createGlobalStyle} from 'styled-components';

export default createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        outline-offset: 0;
        box-sizing: border-box;// Vai fazer caber com a margem
    }

//Em public/index.html veja que por padrão <div id="root"
html, body, #root{
    min-height: 100%; //Vai marcar o background na tela toda, não só o que tem dentro de algum componente
}

body{
    background: #0d2632;
    font-size: 14px;
}

body, input, button{
    color: #222;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
}

button{
    cursor: pointer;
}

`;