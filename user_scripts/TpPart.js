world.bricks.forEach(async(brick) => { // Gets all bricks
    if (brick.name == "teleport") { // Is the brick named teleport??
        ConvertBlock(brick) // Do this function
    }
})

function ConvertBlock(brick) {
    brick.touching(debounce((p) => { // Who's the player that touched block?
        p.setPosition(new Vector3(116,22,4)) // Moves the player to the location.
   }), 2000) // Wait of 2 seconds.
}