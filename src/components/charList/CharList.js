import {Component} from "react";
import PropTypes from 'prop-types'

import './charList.scss';

import MarvelService from "../../services/MarvelService";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/errorMessage";


class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        charsOffset: 210,
        newListLoading: false
    }

    MarvelService = new MarvelService()

    onListLoading = () => {
        this.setState({newListLoading: true})
    }

    onListLoaded = (newCharsList) => {
        this.setState(({chars, charsOffset}) => ({
            chars: [...chars, ...newCharsList],
            loading: false,
            charsOffset: charsOffset + 9,
            newListLoading: false
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateList = () => {
        this.onRequest(this.state.charsOffset)
    }

    onRequest = (offset) => {
        this.onListLoading()
        this.MarvelService
            .getAllCharacters(offset)
            .then(this.onListLoaded)
            .catch(this.onError)
    }

    componentDidMount() {
        this.updateList()
    }

    refsList = []

    setRef = (ref) => {
        this.refsList.push(ref)
    }

    focusOnItem = (id) => {
        this.refsList.forEach((item) => item.classList.remove('char__item_selected'))
        this.refsList[id].classList.add('char__item_selected')
    }

    render(){
        const {chars, loading, error, charsOffset, newListLoading} = this.state
        const {onChangeChar} = this.props

        const errorMessage = error ? <ErrorMessage/> : null
        const spinner = loading ? <Spinner/> : null
        const content = !(loading || errorMessage) ? <View chars={chars} setRef={this.setRef} onChangeChar={onChangeChar} focusOnItem={this.focusOnItem}/> : null

        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
                <button className="button button__main button__long" disabled={newListLoading} onClick={() => this.onRequest(charsOffset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

const View = ({chars, onChangeChar, focusOnItem, setRef}) => {
    return (
        <ul className="char__grid">
            {chars.map((item, i) => {
                let imgStyle = {'objectFit' : 'cover'}
                if (item.thumbnail.includes('image_not_available')){
                    imgStyle = {'objectFit' : 'unset'}
                }
                return (
                    <li className="char__item" key={item.id} ref={setRef} onClick={() => {onChangeChar(item.id); focusOnItem(i)}}>
                        <img src={item.thumbnail} alt="abyss" style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                )
            })}
        </ul>
    )
}

CharList.propTypes = {
    onChangeChar: PropTypes.func.isRequired
}

export default CharList;