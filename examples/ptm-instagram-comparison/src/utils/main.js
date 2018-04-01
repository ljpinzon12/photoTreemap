let photoTreemap;
let mainTree;

//Init the photoTreeMap
export async function initPhotoTreeMap() {
  //Setup the PhotoTreeMap
  photoTreemap = new window.TreeMap("#target")
    .width(window.innerWidth * 0.8)
    .height(window.innerHeight * 0.8)
    .showNodeTextTitle(false)
  ;
  mainTree = {
    id: 'InstagramComparision',
    value: 0,
    label: 'InstagramComparision',
    children : []
  }
}

export async function addNewUserToPhotoTreeMap(user) {
  // console.log(user);
  //Create the hierarchy with the nodes of the user
  const newTree = await buildTreeWithUser(user);
  // console.log(newTree);

  //Increase the value of the MainTree based on the new tree
  mainTree.value += newTree.value;

  //Add the new tree to the main tree and bind the hierarchy with the PhotoTreeMap
  mainTree.children.push(newTree);
  // console.log('mainTree',mainTree);
  photoTreemap.update({...mainTree});
  return user;
}

export async function deleteUserFromPhotoTreeMap(user) {
  // console.log(user);
  //Find the tree to delete
  const treeToDelete = mainTree.children.find(c => c.id === user.id);

  //Decrease the value of the MainTree based on the tree to delete
  mainTree.value -= treeToDelete.value;

  //Delete the tree
  mainTree.children = mainTree.children.filter( c => c.id !== user.id);
  // console.log('mainTree',mainTree);
  photoTreemap.update({...mainTree});
  return user;
}

//Create a hierarchy based in images nodes
export function buildTreeWithUser(user) {
  return new Promise((resolve, reject) => {
    const newTree = {
      id: user.id,
      value: user.images.reduce((t, c) => {
        return t + c.likes_count;
      }, 0),
      label: user.full_name
    };
    newTree.children = user.images.map(c => {
      return {
        id: c.id,
        value: c.likes_count,
        label: c.shortcode,
        img: c.src
      }
    });
    resolve(newTree);
  });
}

//Show notification
export function showNotification (message) {
  window.alertify.notify(message, 'custom', 7);
}