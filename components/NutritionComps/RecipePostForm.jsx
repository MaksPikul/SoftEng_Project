import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { usePosts } from '../blogComps/PostsContext';
import { supabase } from '../../lib/supabase';
import { useNavigation } from "@react-navigation/native";
import SavedRecipes from '../../screens/SavedRecipes';

const RecipePostForm = ({ user_ID }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const { addPost } = usePosts();
  const navigation = useNavigation();

  

  async function addRecipe({title, description, ingredients }) {
    const { data, error } = await supabase
    .from('recipe')
    .insert([
      { created_by: user_ID, name: title, description: description, ingredients: ingredients}
    ])
    .select()

    console.log("db data", error);
  }

  const handleSubmit = () => {
    addPost({
      type: 'Recipe',
      title,
      description,
      ingredients,
    });

    setTitle('');
    setDescription('');
    setIngredients('');
    console.log(title, description, ingredients);
    addRecipe({title: title, description: description, ingredients:ingredients});
    

  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Recipe Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter recipe title"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe the recipe"
        value={description}
        multi={true}
        height={200}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Ingredients</Text>
      <TextInput
        style={styles.input}
        placeholder="List ingredients separated by commas"
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />
      {/* <TouchableOpacity > */}
        {/* style={styles.button} */}
        <View>

        <Button style={styles.button} onPress={()=>{
          handleSubmit()
          navigation.navigate("Saved Recipes")}} title="Post Recipe" color={'#58a61c'} />

      {/* </TouchableOpacity> */}
      
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    borderColor: '#58a61c',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#58a61c',
    borderRadius: 25,
    padding: 10,
    paddingBottom: 10,
    marginBottom: 25,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RecipePostForm;



/*<Button
        title="View My Recipes"
        onPress = {() => navigation.navigate("Saved Recipes")}
        color={'#58a61c'}
        style={styles.button}
        /> */
