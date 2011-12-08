<div class="view">
	<a href="javascript:void(0);" onclick="function_balance()">日记账</a>
	<a href="javascript:void(0);" onclick="function_balance_add()">(增加)</a>
</div>

<div class="view">
	<h1>日记账</h1>
<?php 
$this->widget('zii.widgets.grid.CGridView', array(
	'id'=>'finance-balance-grid',
	'dataProvider'=>$dataProvider,
	'columns'=>array(
		'id',
		'date',
		'money',
		array(
			'name'=>'pay_type',
			'header'=>'收支类型',
			'value'=>'FinanceUtil::pay_type($data->pay_type)',
		),
		array(
			'header'=>'支付方式',
			'value'=>'FinanceUtil::pay_mode($data->pay_mode)',
		),
		'description',
		array(
			'class'=>'CButtonColumn',
			'header'=>'操作',
			'buttons'=>array(
			 	'update'=>array(
		           	'label'=>'编辑',
		           	'imageUrl'=>'/css/update.png',	
        		   	'url'=>'',
		      		'options'=>array('onclick'=>'function_balance_edit(this)'),
	            ),
	            'del'=>array(
		           	'label'=>'删除',	
	            	'imageUrl'=>'/css/delete.png',
					'url'=>'',
		      		'options'=>array('onclick'=>'click_delete(this)'),
	            ),
             ),
        	'template'=>'{update} {del}',
            'htmlOptions'=>array(
		        'style'=>'width:80px;'
		    ),
		),
	),
)); ?>
</div>

<div id="balanceDialog">
	<div id="balance_form_add" class="form"></div>
</div>

<script src="/js/finance.js"></script>