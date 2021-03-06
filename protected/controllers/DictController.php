<?php

class DictController extends Controller
{
	public $layout='//layouts/column2';

	public function filters()
	{
		return array(
			'accessControl', // perform access control for CRUD operations
		);
	}

	/**
	 * Specifies the access control rules.
	 * This method is used by the 'accessControl' filter.
	 * @return array access control rules
	 */
	public function accessRules()
	{
		return array(
			array('allow', 
				'actions'=>array('index','view',
					'addTagWord','delTagWord','jSONTags','jSONWordsByTag',
					//'jSONTags'
					),
				'users'=>array('@'),
			),
			array('deny',
				'users'=>array('*'),
			),
		);
	}
	
	public function actionIndex(){
		$this->render('index',array());
	}
	
	/*
	 * 显示Tags
	 */
	public function actionJSONTags(){
		$tags=DictTag::model()->findAll();
		$j_tags=array();
		foreach($tags as $row){
			$line = array(
				'id'=>$row['id'],
				'name'=>$row['name'],
			);
			array_push($j_tags, $line);
		}
		echo WebUtil::jsonp($j_tags);
		Yii::app()->end();
	}
	
	/*
	 * 查单词通过tag
	 */
	public function actionJSONWordsByTag($tid){
		$words=DictTagWord::model()->findAll('tid=:tid',
			array(':tid'=>$tid)
		);
		
		$j_words=array();
		foreach($words as $row){
			$line = array(
				'word'=>$row['word'],
				'word_cn'=>$row['dword']['phonet'],
			);
			array_push($j_words, $line);
		}
		echo CJSON::encode($j_words);
		Yii::app()->end(); 
	}
	
	/*
	* 增加一个tag word
	*/
	public function actionAddTagWord(){
		$word = DictWord::model()->findByPk($_POST['dict_word']);
		if(empty($word)){
			$word=new DictWord;
			$word['word']=$_POST['dict_word'];
		} else {
			$word['word']=$_POST['dict_word'];
		}
		$word->save(false);
		
		$tagword=DictTagWord::model()->find('tid=:tid and word=:word',
			array(':tid'=>$_POST['dict_tag'],':word'=>$_POST['dict_word'])
		);
		
		if(empty($tagword)){
			$tagword = new DictTagWord;
			$tagword['tid']=$_POST['dict_tag'];
			$tagword['word']=$_POST['dict_word'];
		} else {
			$tagword['word']=$_POST['dict_word'];
		}
		
		$json=array('success'=>false);
		if($tagword->save(false)){
			$json['success']=true;
		}
		
		echo CJSON::encode($json);
		Yii::app()->end();
	}
	
	/*
	* 删除一个tag word
	*/
	public function actionDelTagWord(){
		$json=array('success'=>false);
		$tagword=DictTagWord::model()->find('tid=:tid and word=:word',array(':tid'=>$_POST['dict_tag'],':word'=>$_POST['dict_word']));
		if($tagword->delete()){
			$json['success']=true;
		}
		echo CJSON::encode($json);
		Yii::app()->end();
	}
	
	//=========================================
	/**
	 * Displays a particular model.
	 * @param integer $id the ID of the model to be displayed
	 */
	public function actionView($id)
	{
		$this->render('view',array(
			'model'=>$this->loadModel($id),
		));
	}

	/**
	 * Creates a new model.
	 * If creation is successful, the browser will be redirected to the 'view' page.
	 */
	public function actionCreate()
	{
		$model=new DictWord;

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['DictWord']))
		{
			$model->attributes=$_POST['DictWord'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->word));
		}

		$this->render('create',array(
			'model'=>$model,
		));
	}

	/**
	 * Updates a particular model.
	 * If update is successful, the browser will be redirected to the 'view' page.
	 * @param integer $id the ID of the model to be updated
	 */
	public function actionUpdate($id)
	{
		$model=$this->loadModel($id);

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['DictWord']))
		{
			$model->attributes=$_POST['DictWord'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->word));
		}

		$this->render('update',array(
			'model'=>$model,
		));
	}

	/**
	 * Deletes a particular model.
	 * If deletion is successful, the browser will be redirected to the 'admin' page.
	 * @param integer $id the ID of the model to be deleted
	 */
	public function actionDelete($id)
	{
		if(Yii::app()->request->isPostRequest)
		{
			// we only allow deletion via POST request
			$this->loadModel($id)->delete();

			// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
			if(!isset($_GET['ajax']))
				$this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
		}
		else
			throw new CHttpException(400,'Invalid request. Please do not repeat this request again.');
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new DictWord('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['DictWord']))
			$model->attributes=$_GET['DictWord'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer the ID of the model to be loaded
	 */
	public function loadModel($id)
	{
		$model=DictWord::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param CModel the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='dict-word-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
}
