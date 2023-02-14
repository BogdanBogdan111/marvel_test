class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    _apiKey = 'apikey=9a661c4d1d8992c95eee88c5b1377169'
    _baseOffset = 250

     getResource = async (url) => {
         let res = await fetch(url)

         if (!res.ok){
             throw new Error(`Could not fetch ${url}, status ${res.status}`)
         }

         return await res.json()
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`)
        return this._transformAllCharacters(res.data.results)
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`)
        return this._transformCharacter(res.data.results[0])
    }

    _transformCharacter = (char) => {
        return {
            name: char.name.length > 24 ? char.name.slice(0,19) + '...' : char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    _transformAllCharacters = (characters) => {
        return characters.map((char) => {
            return {
                id: char.id,
                name: char.name,
                description: char.description,
                thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension
            }
        })
    }
}

export default MarvelService;