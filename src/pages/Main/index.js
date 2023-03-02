import React, {  useCallback, useState, useEffect } from 'react';
import { Container, Form, SubmitButton, List, DeleteButton } from './styles';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';

import { Link } from 'react-router-dom';

export default function Main(){

    const [newRepo, setNewRepo]=useState('');
    const [repositorios, setRepositorios] =useState([]);
    const [loading, setLoading]=useState(false);
     // Manter a informação na tela. Fazer ALERTAS.
     const [alerta, setAlerta]=useState(null);

    // Salvar em localStorage. Criar DidMount e DidUpdate. Importar useEffect


    // DidMount - Buscar ****** DEIXAR DidMount """ACIMA""" PARA MANTER A INFORMAÇÃO NA TELA. Se deixar abaixo de DidUpdate ele apaga tudo.
    useEffect(()=>{
        const repoStorage = localStorage.getItem('repos'); // 'repos' foi o nome dado para salvar.
        
        if(repoStorage){ // Se tiver algo salvo colocar no array
            setRepositorios(JSON.parse(repoStorage)); //Tirar conversão do localStorage aqui. Testar o projeto agora.
        }

    }, []);


    // DidUpdate - Salvar alterções. Buscar TUDO que tiver e salvar
    useEffect(()=>{
        localStorage.setItem('repos', JSON.stringify(repositorios));//Converter sempre para localStorage

    }, [repositorios]);// Se deixar essa parte em branco vai fazer como se fosse DidMount, por isso passar parametro.
    
   
    



    function handleInputChange(e){
        setNewRepo(e.target.value);
        setAlerta(null);//Passar para null para exibir a borda vermelha do styles.js e garantir que vai digitar corretamente
    }

    const handleSubmit = useCallback((e)=>{
        e.preventDefault();

        async function submit(){
            setLoading(true);// true por estar tentando fazer a requisiçãoe depois dar um false lá em baixo
             setAlerta(null);// Manter a informação na tela. Garantir que está null



           // Manter a informação na tela. Fazer verificações antes se está em branco ou outra coisa, duplicado...
           if(newRepo === ''){
            toast.error('Precisa indicar um repósitório existente.');
            throw new Error('Precisa indicar um repósitório existente.');
            

           }



            //vai tentar fazer a requisição
            try{
                
                const response= await api.get(`repos/${ newRepo }`) 

                 // Manter a informação na tela. Fazer verificações antes se está duplicado.
                 const hasRepo= repositorios.find(repo => repo.name === newRepo);
                 if(hasRepo){
                    toast.info('Esse repositório já está na sua lista.');
                    throw new Error('Repositório duplicado.');
                    
                 }

    
            //Para salvar "full_name"
            const data = {
              name: response.data.full_name,
            }

            setRepositorios([...repositorios, data]);        
            setNewRepo('');
            //console.log(response.data)
            }
            catch(err){
                // Manter a informação na tela. Se der erro:
                setAlerta(true); //Será passado para Form error. error={alerta}    Veja em styles.js (Form / input) como ficou.
                console.log(err);

            }finally{//para cancelar a busca 
                setLoading(false); // Voltar para false
            }
        
            
            }
        submit(); //Tem que chamar aqui para ser executada a função
    },[newRepo, repositorios]);//Quando uma ou outra for atualizada vai chamar o useCallback
      
    
//Implementar a função deletar. COMO VAI MANIPULAR, PEGAR DADOS E ALTERAR  DADOS usar const e não uma função
const HandleDelete = useCallback((repo)=> {
    //repo vai receber o nome
    const find = repositorios.filter(r=>r.name !== repo); //Vai pegar TODAS que não clicou e devolver para a variável find MENOS a que está clicada e será apagada

    setRepositorios(find);
}, [repositorios]);


    return(
        <Container>
            
            <h1>
                <FaGithub size={25}/>
                Meus repositórios
            </h1>
            
            {/*Para criar um desencadeamento novo, criar uma nova tag */}
            <Form onSubmit={ handleSubmit } error={alerta}>

                <input type='text' placeholder='Adicionar repositórios'
                value={ newRepo } onChange={ handleInputChange }
                />

                {/*//vai tentar fazer a requisição loading, ir em Styles para configurar isso*/}
                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color='#fff' size={15} />
                    ) : (
                        <FaPlus color='#fff' size={15}/>
                    )}
                    
                </SubmitButton>

            </Form>


            {/*Listar na tela os repositórios */}
            <List>
                {repositorios.map(repo=>(
                    <li key={repo.name}>
                        <span> {/*Criar um componente para Delete  */}

                            <DeleteButton onClick={()=> HandleDelete(repo.name) }>
                                <FaTrash size={15}/>
                            </DeleteButton>
                            
                            {repo.name}</span>
                       {/*  Exibir detalhes do repositório. Isso <a href='#'>  foi substituido por: */} 
                         <Link to={`/repositorio/${ encodeURIComponent(repo.name)}`}>  {/*repo.name passa o nome do repositório. Agora deve ir em Repositorio/index.js para exibir resultado.
                        (ENCOD...) encodeURIComponent é para dizer que é um parâmetro e não um diretório. Está passando uma uma "/"  assim: angular/angular */}
                             <FaBars size={20}/>
                         </Link>                            
                            
                       
                    </li>
                ))}
            </List>             



        </Container>
        
    )
}