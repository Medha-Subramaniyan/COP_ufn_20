import React, { useState } from 'react';
import { buildPath }  from './Path';
import { retrieveToken, storeToken } from '../tokenStorage';

function CardUI()
{   
    const [message,setMessage] = useState('');
    const [searchResults,setResults] = useState('');
    const [cardList,setCardList] = useState('');
    const [search,setSearchValue] = React.useState('');
    const [card,setCardNameValue] = React.useState('');
    
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    let userId : string = ud.userId;
    
    async function addCard(event:any) : Promise<void>
    {
        event.preventDefault();

        let obj = {userId:userId, card:card, userJwt:retrieveToken()};
        let js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath('api/addcard'),
            {method:'POST', body:js, headers:{'Content-Type':'application/json'}});

            let txt = await response.text();
            let res = JSON.parse(txt);

            if( res.error.length > 0 )
            {
                setMessage( "API Error:" + res.error );
            }
            else
            {
                setMessage('Card has been added');
                storeToken(res.userJwt);
            }
        }
        catch(error:any)
        {
            setMessage(error.toString());
        }
    };

    async function searchCard(event:any) : Promise<void>
    {
        event.preventDefault();

        let obj = {userId:userId, search:search, userJwt:retrieveToken()};
        let js = JSON.stringify(obj);
        
        try
        {
            const response = await fetch(buildPath('api/searchcards'),
            {method:'POST', body:js, headers:{'Content-Type':'application/json'}});

            let txt = await response.text();
            let res = JSON.parse(txt);
            let _results = res.results;
            let resultText = '';
            for( let i=0; i<_results.length; i++ )
            {
                resultText += _results[i];
                if( i < _results.length - 1 )
                {
                    resultText += ', ';
                }
            }

            setResults('Card(s) have been retrieved');
            storeToken( res.userJwt );
            setCardList(resultText);
        }
        catch(error:any)
        {
            alert(error.toString());
            setResults(error.toString());
        }
    };

    function handleSearchTextChange( event: any ) : void
    {
        setSearchValue( event.target.value );
    }

    function handleCardTextChange( event: any ) : void
    {
        setCardNameValue( event.target.value );
    }

    return(
    <div id="cardUIDiv">
        <br />
        Search: <input type="text" id="searchText" placeholder="Card To Search For"
            onChange={handleSearchTextChange} />
        <button type="button" id="searchCardButton" className="buttons"
            onClick={searchCard}> Search Card</button><br />
        <span id="cardSearchResult">{searchResults}</span>
        <p id="cardList">{cardList}</p><br /><br />
        Add: <input type="text" id="cardText" placeholder="Card To Add"
            onChange={handleCardTextChange} />
        <button type="button" id="addCardButton" className="buttons"
            onClick={addCard}> Add Card </button><br />
        <span id="cardAddResult">{message}</span>
    </div>
    );
};

export default CardUI;