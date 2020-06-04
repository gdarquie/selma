import React, {useState} from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { Paper, Container, Typography, Grid } from "@material-ui/core";
import "../styles/categoryPage.css";

const CategoriesPage = ({data}) =>  {

  const [categoriesState, setCategoriesState] = useState(data.mc3.categories.edges);

  function getModelsCategories(categoriesState: object[]): string[] {
    const modelsList = [];
    const modelsListRaw = [];

    categoriesState.map(({node}) => {
      // if it's the first loop, modelsList is empty
      if (modelsList.length === 0) {
        modelsList.push({ "title": node.model, "value": 1});
        modelsListRaw.push(node.model);
      }
      // else if modelsList contains a model, we check if the model has been already added to the raw list
      else {
        // if yes, we increase the value
        if(modelsListRaw.includes(node.model)) {
          modelsList.map(model => {
            if (node.model === model.title) {
              model.value += 1;
            }
          })
        }
        // if not, we set the models list and update the raw list
        else {
          modelsList.push({ "title": node.model, "value": 1});
          modelsListRaw.push(node.model);
        }
      }
    });

    return modelsList;
  }

  function getOrderedCategories() {
    // group all categories by models
    const modelsList = getModelsCategories(categoriesState);
    const orderedCategories = [];
    console.log(modelsList);

    modelsList.map(model => {
      categoriesState.map(({node}) => {
          if (node.model === model.title) {
            orderedCategories.push(node);
          }
      })
    })

    return orderedCategories;
  }


  function displayCategory(category) {
    return (
          <div key = {category.uuid}>
            <h3 className='category-title'>{category.title} [{category.model}]</h3>

            <Paper elevation={0}>
              <section className='category-section'>
                <h4 className='property-title'>Description</h4>
                <p>{category.description}</p>
              </section>
            </Paper>

            <Paper elevation={0}>
              <section className='category-section'>
                <h4 className='property-title'>Attributes ({category.attributesCount})</h4>
                <ul>
                  {category.attributes.map(attribute => (
                    <li>{attribute.title}</li>
                  ))}
                </ul>
              </section>
            </Paper>
          </div>
    )
  }

  function getCategoriesByModel(model:string, categoriesList:object[]):object[] {
    const modelCategoriesList = [];
    categoriesList.map(category => {
      if (category.model === model) {
        modelCategoriesList.push(category);
      }
    });

    return modelCategoriesList;
  }

  // get all the categories group by all the models
  function getResponseForAllCategoriesByModels(models, categoriesList) {
    const response = [];
    models.map(model => {
      const modelCategoriesList = getCategoriesByModel(model, categoriesList);

      response.push(<h2>{model}</h2>)
      modelCategoriesList.map( category => {
        response.push(displayCategory(category));
      })
    })

    return response;
  }

  function displayCategories() {
    return getResponseForAllCategoriesByModels(['film', 'number', 'song'], getOrderedCategories());;
  }

  return (
        <Layout>
            <Container className='container' maxWidth="sm">
              {displayCategories()}
            </Container>
        </Layout>
    );
};

export default CategoriesPage;

export const query = graphql`
  {
    mc3 {
      categories {
        edges {
          node {
            model
            title
            uuid
            description
            attributesCount
            attributes
          }
        }
      }
    }
  }
`;