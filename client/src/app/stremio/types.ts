export type StremioResource
  = 'catalog'
  | 'meta'
  | 'stream'
  | 'subtitles'
  | 'stream'
  | 'addon_catalog';

export interface StremioContentCatalog {
  type: string
  id: string
  name: string
  extra: Array<{
    name: string,
    isRequired?: boolean,
    options?: string,
    optionsLimit?: number
  }>
}

export interface StremioAddonCatalog {
  type: string
  id: string
  name: string
  background?: string
  logo?: string
  contactEmail?: string
  behaviorHints?: {
    adult?: boolean
    p2p?: boolean
    configurable?: boolean
    configurationRequired?: boolean
  }
}

export interface StremioManifest {
  id: string
  name: string
  description: string
  version: string
  resources: StremioResource[]
  catalogs: StremioContentCatalog[]
  addonCatalogs?: StremioAddonCatalog[]
  idPrefixes?: string[]
}

export interface StremioMeta {
  id: string
  type: 'series' | 'movie' | 'channel' | 'tv'
  name: string
  poster: string
  posterShape?: 'square' | 'poster' | 'landscape'
  background?: string
  logo?: string
  description?: string
  releaseInfo?: string
  imdbRating?: string
  released?: string
  links?: unknown[] // MetaLinkObject
  videos?: Array<{ // video objects used for channels and series
    id: string
    title: string
    released: string
    thumbnail?: string
    streams?: StremioStream[]
    available?: boolean
    episode?: number
    season?: number
    trailers?: StremioStream[]
    overview?: string
  }> 
  runtime?: string
  language?: string
  country?: string
  awards?: string
  website?: string
  behaviorHints?: {
    defaultVideoId?: string
  }

  // soon to be deprecated in favour of links
  genres?: string[]
  director?: string[]
  cast?: string[]
  trailers?: Array<{ source: string, type: 'Trailer' | 'Clip' }>

  // observed but not in spec
  score?: number
  popularity?: number
}

export interface StremioStream {
  name?: string // not in spec
  title?: string
  subtitles?: Array<{ id: string, url: string, lang: string }>

  url?: string
  ytId?: string
  infoHash?: string
  fileIdx?: number
  externalUrl: string
}