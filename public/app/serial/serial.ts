
export interface ISerial{
    _id: string,
    serial_id: number,
    _v: number
    name: string,
    rus_name:string,
    orig_name:string,
    url: string,
    source: string,
    poster: string,
    poster_color:string,
    prod_country: string,
    start_year: number,
    genres: Array<string>,
    seasons_num: number,
    is_on_air: Boolean,
    own_site: string,
    description: string,
    actors: string,
    directors: string,
    scriptwriters:string,
    plot: string,
}