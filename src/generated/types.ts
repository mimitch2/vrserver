type StringOrInt = string | number;

interface Pagination {
    items: number;
    page: number;
    pages: number;
    per_page: number;
}

interface Artist {
    name?: string;
}

interface Label {
    name?: string;
}

interface Company {
    name: string;
    entity_type_name: string;
}

interface SeriesEntry {
    name: string;
    entity_type_name: string;
}

interface ArtistMember {
    id: string;
    name: string;
    active?: boolean;
    thumbnail_url?: string;
}

interface Image {
    resource_url: string;
    height?: number;
    width?: number;
}

interface ArtistPage {
    namevariations?: string[];
    profile?: string;
    images?: Image[];
    name: string;
    members?: ArtistMember[];
}

interface Format {
    qty?: string;
    text?: string;
    name?: string;
    descriptions?: string[];
}

interface UserData {
    in_collection?: boolean;
    in_wantlist?: boolean;
}

interface BasicInformation {
    id: string;
    title?: string;
    thumb?: string;
    artists?: Artist[];
    year?: StringOrInt;
    country?: string;
    formats?: Format[];
    format?: string[];
    label?: string[];
    released?: string;
    genres?: string[];
    styles?: string[];
    user_data?: UserData;
    type?: string;
}

interface ArtistSearch {
    id: string;
    type: string;
    user_data: UserData;
    title: string;
    thumb?: string;
    cover_image?: string;
}

interface InstanceNotes {
    field_id?: number;
    value?: string;
}

interface Releases {
    id: string;
    date_added?: string;
    rating?: number;
    basic_information: BasicInformation;
}

interface CollectionInstance {
    id: string;
    date_added?: string;
    instance_id: string;
    folder_id?: string;
    rating?: number;
    notes?: InstanceNotes[];
    basic_information: BasicInformation;
}

interface Collection {
    pagination: Pagination;
    releases: CollectionInstance[];
}

interface IsInCollectionResponse {
    isInCollection: boolean;
    pagination: Pagination;
    releases: CollectionInstance[];
}

interface ReleasesSearchResult {
    isReleases?: boolean;
    pagination: Pagination;
    results: Releases[];
}

interface ArtistSearchResult {
    isArtists?: boolean;
    pagination: Pagination;
    results: ArtistSearch[];
}

interface MasterSearchResult {
    isMasters?: boolean;
    pagination: Pagination;
    results: Releases[];
}

type SearchResults = ArtistSearchResult | ReleasesSearchResult | MasterSearchResult;

interface TrackList {
    position: string;
    title: string;
    duration: string;
}

interface Identifier {
    type: string;
    value: string;
    description?: string;
}

interface DiscogsRating {
    count: number;
    average: number;
}

interface DiscogsCommunity {
    have: number;
    want: number;
    rating: DiscogsRating;
}
