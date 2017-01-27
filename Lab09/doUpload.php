<?php

	session_start();
	
	set_time_limit(300);
	
	if($_POST["uploadFile"] != "") {
		$fileExt = strrchr($_FILES["userfile"]["name"], ".");
		//echo $fileExt;
		if(($fileExt != ".jpg") && ($fileExt != ".gif") && ($fileExt!= ".png")) {
			$_SESSION["badFileType"] = "You can not upload that a file of type ".$fileExt;
		}
		else {
			$fileName = $_FILES["userfile"]["name"];
			
			if(!is_uploaded_file($_FILES["userfile"]["tmp_name"])) {
				echo "Problem: possible file attack";
				exit;
			}
			
			$counter = 24;
			
			$upfile = "upload/".$_POST["category"].$counter.$fileExt;
			//echo($upfile);
			
			if(!copy($_FILES["userfile"]["tmp_name"], $upfile)) {
				echo ("Problem: could not move file into that directory");
				exit;
			}
			$_SESSION["badFileType"] = "Upload Successfully!";
		}
	}
	else {
		$_SESSION["badFileType"] = "";	
	}
	
	header("Location:upload.php");

?>