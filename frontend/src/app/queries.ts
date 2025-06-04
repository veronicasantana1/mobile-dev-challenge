import { gql } from "@apollo/client";

export const GET_NOODLES = gql`
  query GetNoodles {
    instantNoodles {
      id
      name
    }
  }
`;

export const GET_NOODLE_BY_ID = gql`
  query GetNoodleById($id: ID!) {
    instantNoodle(where: { id: $id }) {
      id
      name
      brand
      spicinessLevel
      originCountry
      rating
      imageURL
      category {
        name
      }
    }
  }
`;
