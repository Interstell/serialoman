export interface IEpisodeDownloadUrl{
    quality: string,
    link: string,
    size: string
}

export interface IEpisode {
    serial_name: string,
    serial_rus_name: string,
    serial_orig_name: string,
    episode_name: string,
    episode_url: string,
    icon: string,
    season: number,
    episode_number: number,
    release_date: Date,
    source: string,
    full_season: boolean,
    download_page_url: string,
    download_urls: IEpisodeDownloadUrl
}