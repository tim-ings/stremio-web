export type StremioResource
  =  'catalog'
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