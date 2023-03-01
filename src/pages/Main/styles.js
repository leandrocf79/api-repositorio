import styled, {keyframes, css} from 'styled-components';

export const Container = styled.div`
  max-width: 700px;
  background: #FFF;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0,0,0, 0.2);
  padding: 30px;
  margin: 80px auto; /*Auto nas laterais vai deixar sempre centralizado*/

  h1{
    font-size: 20px;
    display:flex;
    align-items: center;
    flex-direction:row;
    
    svg{
      margin-right: 20px;
    }

  }
`;



export const Form = styled.form`
  margin-top: 30px;
  display:flex;
  flex-direction: row;

  input{
    flex:1;
     // Manter a informação na tela. Se der erro exibir através do border.
    //border: 1px solid #DDD;
    border: 1px solid ${props=> ( props.error ? '#ff0000' : '#ddd' )};// Agora ir em handleInputChange para garantir que vai digitar corretamente

    padding: 10px 15px;
    border-radius: 4px;
    font-size: 17px;
  }  
`;


// Criar animação para &[disable] do botão. Passar de onde começa e termina
const animate = keyframes`
  from{
    transforrm: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
`;


export const SubmitButton = styled.button.attrs(props=>(  {
  type: 'submit',

//Quando tentar fazer a requisição loading
  disable: props.loading,


  }))`
  background:#0D2636;
  border: 0;
  border-radius: 4px;
  margin-left: 10px;
  padding: 0 15px;
  display: flex;   /*vai alinhar em todos os ângulos*/
  justify-content: center;
  align-items: center;

  //importar  {keyframes, css} 
  &[disable]{
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${props => props.loading && css`
    svg{
      animation: ${animate} 2s linear infinite;
    }
  `}
`;


export const List=styled.ul`
  list-style: none;
  margin-top: 20px;

  li{
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    & + li{ //Só vai aplicar do SEGUNDO em diante
      border-top: 1px solid 		#C0C0C0;
    }

    a{
      color: #0d2636;
      text-decoration: none;
    }
  }

`;


export const DeleteButton = styled.button.attrs({
  type: 'button'
})`
  margin-left: 6px;
  background: transparent;
  color: #0d2636;
  border: #0d2636;
  padding: 5px 17px 0 0;
  outline: 0;
  border-radius: 5px;
`;