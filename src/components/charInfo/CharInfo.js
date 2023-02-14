import {Component, Fragment} from "react";

import MarvelService from "../../services/MarvelService";

import './charInfo.scss';

import Skeleton from "../skeleton/Skeleton";
import ErrorMessage from "../errorMessage/errorMessage";
import Spinner from "../spinner/Spinner";


class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false,
    }

    MarvelService = new MarvelService()

    onCharLoaded = (char) => {
        this.setState({
            char: char,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateChar = () => {
        this.setState({
            loading: true,
        })
        this.MarvelService
            .getCharacter(this.props.charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId){
            this.updateChar()
        }
    }

    render(){
        const {char, error, loading} = this.state

        const errorMessage = error ? <ErrorMessage/> : null
        const spinner = loading ? <Spinner/> : null
        const skeleton = !(loading || error || char) ? <Skeleton/> : null
        const view = char && !loading ? <View char={char}/> : null

        return (
            <div className="char__info">
                {spinner}
                {errorMessage}
                {skeleton}
                {view}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name ,description, thumbnail, wiki, homepage, comics} = char

    let imgStyle = {'objectFit' : 'cover'}
    if (thumbnail.includes('image_not_available')){
        imgStyle = {'objectFit' : 'contain'}
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} style={imgStyle} alt="abyss"/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length
                    ? comics.slice(0,10).map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                    : 'Comics not found =('
                }
            </ul>
        </>
    )
}

export default CharInfo;