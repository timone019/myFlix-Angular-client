// movie.interface.ts
export interface Movie {
    _id: string;
    Title: string;
    Description: string;
    Genre: {
      Name: string;
      Description: string;
    };
    Director: {
      Name: string;
      Bio: string;
      Birth?: string; // Birth is not present in your schema, so it's marked as optional
    };
    Actors: string[];
    ImagePath: string;
    Featured: boolean;
    Year: string;
    TrailerPath: string;
    Rating: string;
    Runtime: string;
    isFavorite?: boolean; // isFavorite is not present in your schema, so it's marked as optional
    heartActive?: boolean;
  }