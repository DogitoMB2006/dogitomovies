interface VidkingOptions {
    color?: string;
    autoPlay?: boolean;
    nextEpisode?: boolean;
    episodeSelector?: boolean;
    progress?: number;
}

export const getVidkingUrl = (
    tmdbId: number,
    type: 'movie' | 'tv',
    season?: number,
    episode?: number,
    options: VidkingOptions = {}
): string => {
    const baseUrl = 'https://www.vidking.net/embed';
    let url = '';

    if (type === 'movie') {
        url = `${baseUrl}/movie/${tmdbId}`;
    } else if (type === 'tv' && season && episode) {
        url = `${baseUrl}/tv/${tmdbId}/${season}/${episode}`;
    } else {
        console.warn('Invalid parameters for Vidking URL');
        return '';
    }

    const params = new URLSearchParams();

    if (options.color) params.append('color', options.color);
    if (options.autoPlay) params.append('autoPlay', 'true');
    if (options.nextEpisode) params.append('nextEpisode', 'true');
    if (options.episodeSelector) params.append('episodeSelector', 'true');
    if (options.progress) params.append('progress', options.progress.toString());

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
};
