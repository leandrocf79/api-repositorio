import React, {useState, useEffect} from 'react';
import { Container, Owner, Loading, BackButton, IssuesList, Pagination, FilterList } from './styles';
import api from '../../services/api';

import { FaArrowLeft } from 'react-icons/fa'; 

export default function Repositorio( {match} ){

    //após testar console.log(repositorioData.data); e o outro criar aqui.
    const [repositorio, setRepositorio] = useState({});// Como será ÚNICO objeto passar {}, se fossem varios passar array []
    const [issues, setIssues] = useState([]);//Varias issues. Passar []
    const [loading, setLoading] = useState(true);//Já vai iniciar carregando
    //Fazer paginação. Iniciar com 1 pois começa na primeira página:
    const [page, setPage] = useState(1);

    //Filtrar exibição por tipo. Genial esse modo de fazer. Muito melhor que criar 3 botões com funções individuais.
    const [filters ]=useState([
        {state: 'all', label: 'Todos', active: true},        
        {state: 'open', label: 'Abertos', active: false},
        {state: 'closed', label: 'Fechados', active: false}
    ]);
//Filtrar exibição por tipo.
    const[filterIndex, setFilterIndex]=useState(0); // Começa na posição '0' do array setFilters. Passar 'active' para o botão em FilterList e modificar as cores no styles.js.
     

    
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
            api.get(`/repos/${nomeRepo}/issues` , { // PAGINAR. O axios tem essa forma.AQUI VAI EXIBIR APENAS 5 ITENS POR PÁGINA. 
                 params: {
                    //state: 'open',

                //Filtrar exibição por tipo
                    state: filters.find( f => f.active).state, //all por padrão (active)

                    per_page: 5   //Paginação foi limitada para 5 itens por pg
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

    },[match.params.repositorio, filters]);
    

//Fazer paginação. Aqui vai receber o handlePage pelo 'page'. 
useEffect(()=>{
    async function loadIssue(){
        //Aqui é só pegar o nome do repositório que ja foi criado anteriormente:
        const nomeRepo = decodeURIComponent(match.params.repositorio);

    
        const response = await api.get(`/repos/${nomeRepo}/issues`, {
            params:{
                //state: 'all',
                //state: 'closed',
                //state: 'open', //Esse 'open' veio da documentação do github. 

        //Filtrar exibição por tipo
                state: filters[filterIndex].state, //Vai pegar o estado do filterIndex. // filters[0].state

                //Veja: https://docs.github.com/pt/rest/guides/using-pagination-in-the-rest-api?apiVersion=2022-11-28
                //Veja: https://docs.github.com/pt/rest/issues/issues?apiVersion=2022-11-28
                page,  // mesmo nome, não precisa repetir:   page: page,
                per_page: 5,

            },
        });
        //Fez a requisição. Agora é só atualizar:
        setIssues(response.data);
        //console.log(filterIndex);//Para saber qual o filter está sendo executado.
    } 
    loadIssue();

 //Filtrar exibição por tipo. Precisa passar tudo aqui.   
},[filters, filterIndex ,match.params.repositorio ,page]);//aqui é quem será monitorado.

//Fazer paginação. Foi criada uma função que recebe duas strings, next e back. 
//Terá que criar o useEffect acima para dar a função dohandlePage
    function handlePage(action){
        //Aqui será atualizada a página:
        setPage(action === 'back' ? page - 1 : page + 1)  

    }

//Filtrar exibição por tipo.
    function handleFilter(index){
        setFilterIndex(index); //Vai passar a posição do index.        
    }    



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

{/*Filtrar exibição por tipo */}
            <FilterList active={filterIndex}>
                {filters.map((filter, index)=>(
                    <button type='button' 
                    key={filter.label}
                    onClick={ ()=> handleFilter(index) }> {filter.label} </button>
                ))}

            </FilterList>


            {/*Exibir issues, será tratado como uma 'ul' e terá as suas 'li' dentro*/}
            <IssuesList>
                {issues.map(item=>( //vai precisar converter para string
                    <li key={String(item.id)}>
                        <img src={item.user.avatar_url} alt={item.user.login}/>
                        <div>
                        <strong>
                            {/*Link externo, usr <a>*/}
                            <a href={item.html_url}> {item.title} </a>

                            {/* Verificar lá em cima em console.log(issuesData.data); as possibilidades de uso aqui.
                            Verificado que labels é um array por isso será usado o modelo abaixo com map() para percorrer todos os itens. */}
                            {item.labels.map(label =>(
                                <span key={ String(label.id) }> { label.name } </span> /*Pode converter para string tb */
                            ))}

                        </strong>

                        <p>{ item.user.login }</p>

                    </div>
                    </li>
                   
                ))}
            </IssuesList>

            {/*Fazer paginação. Dado o nome de Pagination para esta parte. */}

            <Pagination>
                <button type='button' onClick={()=> handlePage('back') } disabled={ page < 2 } >Anterior</button>
                <button type='button' onClick={()=> handlePage('next') }>Próxima</button>
            </Pagination>

        </Container>
        
    )
}