for (i = 0; i < 21; i++) {
  for (j = 0; j < 23; j++) {
    console.log(".tile.c"+(j+1)+"r"+(i+1)+" {");
    console.log("    background-position: "+(j*-32)+"px "+(i*-32)+"px;");
    console.log("}");
  }
}
