---
icon: pen-to-square
date: 2026-01-29
category:
  - Job Notes
tag:
  - China Merchant Bank
---

# 信用卡业务相关概念

## 重资产

### 定义
重资产（Heavy Asset）是指信用卡业务中，银行需要承担较大资金成本和风险成本的资产类型。主要包括：

- **信用卡授信额度**：银行向持卡人提供的信用额度
- **分期付款余额**：持卡人办理分期后的未还本金
- **现金分期**：持卡人提取现金后的未还本金
- **循环信用余额**：持卡人未全额还款产生的循环利息

### 特点
- **资金占用大**：银行需要准备大量资金用于放贷
- **风险较高**：存在持卡人违约、逾期等风险
- **收益周期长**：需要通过分期手续费、利息等方式逐步回收
- **监管要求严格**：需要满足资本充足率等监管指标

### 业务场景
```java
// 重资产计算示例
public class HeavyAssetService {
    
    /**
     * 计算客户重资产总额
     */
    public BigDecimal calculateHeavyAsset(Long customerId) {
        // 信用卡授信额度
        BigDecimal creditLimit = getCreditLimit(customerId);
        
        // 分期付款余额
        BigDecimal installmentBalance = getInstallmentBalance(customerId);
        
        // 现金分期余额
        BigDecimal cashInstallmentBalance = getCashInstallmentBalance(customerId);
        
        // 循环信用余额
        BigDecimal revolvingBalance = getRevolvingBalance(customerId);
        
        return creditLimit
                .add(installmentBalance)
                .add(cashInstallmentBalance)
                .add(revolvingBalance);
    }
}
```

## 催收

### 定义
催收（Collection）是指银行对逾期未还款的信用卡账户进行追讨的行为，旨在降低不良资产率，减少资金损失。

### 催收流程

#### 1. 催收阶段划分
- **M0（正常）**：未逾期，正常还款
- **M1（逾期1-30天）**：短信、电话提醒
- **M2（逾期31-60天）**：正式催收，发送催收函
- **M3（逾期61-90天）**：加强催收，可能委托第三方
- **M4+（逾期90天以上）**：严重逾期，可能进入法律程序

#### 2. 催收方式
- **短信催收**：自动发送还款提醒短信
- **电话催收**：客服人员电话联系持卡人
- **信函催收**：发送催收函、律师函
- **上门催收**：委托第三方机构上门
- **法律催收**：提起诉讼，申请强制执行

### 代码示例
```java
@Service
public class CollectionService {
    
    /**
     * 根据逾期天数判断催收阶段
     */
    public CollectionStage getCollectionStage(int overdueDays) {
        if (overdueDays <= 0) {
            return CollectionStage.M0;
        } else if (overdueDays <= 30) {
            return CollectionStage.M1;
        } else if (overdueDays <= 60) {
            return CollectionStage.M2;
        } else if (overdueDays <= 90) {
            return CollectionStage.M3;
        } else {
            return CollectionStage.M4_PLUS;
        }
    }
    
    /**
     * 执行催收操作
     */
    public void executeCollection(Long accountId) {
        Account account = accountService.getAccount(accountId);
        int overdueDays = calculateOverdueDays(account);
        CollectionStage stage = getCollectionStage(overdueDays);
        
        switch (stage) {
            case M1:
                sendSmsReminder(account);
                break;
            case M2:
                sendCollectionLetter(account);
                makePhoneCall(account);
                break;
            case M3:
                delegateToThirdParty(account);
                break;
            case M4_PLUS:
                initiateLegalAction(account);
                break;
        }
    }
}
```

### 催收策略
- **早期干预**：逾期初期及时提醒，提高还款率
- **个性化催收**：根据客户特征制定不同策略
- **合规催收**：遵守相关法律法规，避免暴力催收
- **数据驱动**：利用大数据分析预测还款概率

## 调扣

### 定义
调扣（Adjustment & Deduction）是指银行对信用卡账户进行的金额调整和扣款操作，包括：

- **调增**：增加账户余额（如退款、冲正）
- **调减**：减少账户余额（如手续费、利息）
- **扣款**：从账户中扣除款项（如自动还款、分期扣款）

### 常见调扣场景

#### 1. 手续费调扣
- **取现手续费**：ATM 取现产生的手续费
- **分期手续费**：办理分期时一次性或分期收取
- **年费**：信用卡年费扣除
- **超限费**：超过信用额度产生的费用

#### 2. 利息调扣
- **循环利息**：未全额还款产生的利息
- **取现利息**：现金提取产生的利息
- **逾期利息**：逾期未还款产生的罚息

#### 3. 退款调增
- **消费退款**：商户退款到信用卡
- **冲正交易**：撤销之前的错误交易
- **争议调账**：处理持卡人争议后的调整

### 代码示例
```java
@Service
public class AdjustmentService {
    
    /**
     * 执行调扣操作
     */
    @Transactional
    public void executeAdjustment(AdjustmentRequest request) {
        // 1. 验证账户状态
        Account account = validateAccount(request.getAccountId());
        
        // 2. 记录调扣流水
        AdjustmentRecord record = AdjustmentRecord.builder()
                .accountId(request.getAccountId())
                .adjustmentType(request.getType())  // ADJUST_INCREASE, ADJUST_DECREASE
                .amount(request.getAmount())
                .reason(request.getReason())
                .operator(request.getOperator())
                .createTime(LocalDateTime.now())
                .build();
        
        adjustmentRecordMapper.insert(record);
        
        // 3. 更新账户余额
        if (request.getType() == AdjustmentType.ADJUST_INCREASE) {
            account.setBalance(account.getBalance().add(request.getAmount()));
        } else {
            account.setBalance(account.getBalance().subtract(request.getAmount()));
        }
        
        accountMapper.updateById(account);
        
        // 4. 发送通知
        notificationService.sendAdjustmentNotification(account, record);
    }
    
    /**
     * 批量调扣（如批量扣分期手续费）
     */
    @Transactional
    public void batchAdjustment(List<AdjustmentRequest> requests) {
        for (AdjustmentRequest request : requests) {
            executeAdjustment(request);
        }
    }
}
```

### 调扣类型枚举
```java
public enum AdjustmentType {
    ADJUST_INCREASE("调增", "增加账户余额"),
    ADJUST_DECREASE("调减", "减少账户余额"),
    FEE_DEDUCTION("手续费扣款", "扣除各种手续费"),
    INTEREST_DEDUCTION("利息扣款", "扣除利息"),
    REFUND("退款", "商户退款"),
    REVERSAL("冲正", "撤销交易");
    
    private final String code;
    private final String description;
}
```

### 注意事项
1. **幂等性**：调扣操作需要保证幂等，避免重复扣款
2. **余额校验**：调减操作前需校验账户余额是否充足
3. **流水记录**：所有调扣操作必须记录详细流水，便于对账
4. **权限控制**：调扣操作需要严格的权限控制，防止误操作
5. **对账机制**：定期与会计系统对账，确保账务一致