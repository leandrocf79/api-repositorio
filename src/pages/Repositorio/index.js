import React, {useState, useEffect} from 'react';
import { Container, Owner, Loading, BackButton } from './styles';
import api from '../../services/api';

import { FaArrowLeft } from 'react-icons/fa'; 

export default function Repositorio( {match} ){

    //após testar console.log(repositorioData.data); e o outro criar aqui.
    const [repositorio, setRepositorio] = useState({});// Como será ÚNICO objeto passar {}, se fossem varios passar array []
    const [issues, setIssues] = useState([]);//Varias issues. Passar []
    const [loading, setLoading] = useState(true);//Já vai iniciar carregando

    useEffect(()=>{
        async function load(){//nomeRepo  é o nome que está recebendo do parâmetro
          const nomeRepo = decodeURIComponent(match.params.repositorio); 
          /* É "repositorio" pq foi o parâmetro criado em Routes.js   <Route exact path='/repositorio/:repositorio' <-- Esse segundo  
        Não exibiu direito, tem que usar (DECOD...)  decodeURIComponent()*/
/*
//Em vez de fazer assim e chamar uma de cada vez. Pode fazer como no outro modelo abaixo e chamar as 2 juntas.
const response = await api.get(`/repos/${nomeRepo}`);
const issues = await api.get(`/repos/${nomeRepo}/issues`);
*/
        //Em vez de chamar uma na sequência da outra, chamar as 2 juntas no array de Promise:
        const [repositorioData, issuesData] = await Promise.all([
            api.get(`/repos/${nomeRepo}`),          //repositorioData - recebe esse conteúdo
                                                    //issuesData - recebe esse conteúdo
            api.get(`/repos/${nomeRepo}/issues` , { // PAGINAR. O axios tem essa forma.
                 params: {
                    state: 'open',
                    per_page: 5
                 }
                })    
        ]);//Testar para passar para state depois
       //console.log(repositorioData.data);
       //console.log(issuesData.data);
      setRepositorio(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false); //Após carregar false

        }

        load(); //  <--------------- Chamar aqui 

    },[match.params.repositorio]);
    

//Controle de exibição. Fazer o controle em Repositorio/styles.js. Ele só vai avançar quando loading estiver totalemnte carregado.
    if(loading){
       return(
        <Loading>
            <h1>Carregando...</h1>
        </Loading>
       )}

    return(

        <Container>

            {/** Botão de voltar. Importar um icone para dar estética. Importar BackButton 
            to='/'  vai voltar para home
            */}
            <BackButton to='/'>
                <FaArrowLeft color='#000' size={30}/>
            </BackButton>
            

            <Owner>
                <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login} /> 
                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
            </Owner>

        </Container>
        
    )
}