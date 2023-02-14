import img from './error.gif'

const errorMessage = () => {
    return (
        <img style={{maxWidth: '250px', margin: '0 auto', display: 'block'}} src={img}/>
    )
}

export default errorMessage