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

## 账单（Bill/Statement）

### 定义
账单是银行定期（通常每月）向持卡人发送的账户交易明细和应还款项汇总。

### 账单组成
- **账单日期**：账单生成日期
- **到期还款日**：最后还款日期
- **账单金额**：本期应还款总额
- **最低还款额**：最低需要还款的金额
- **交易明细**：本期所有交易记录
- **积分明细**：积分获得和消费记录

### 代码示例
```java
@Entity
public class Bill {
    @Id
    private Long id;
    
    @Column(name = "card_id")
    private Long cardId;
    
    @Column(name = "bill_date")
    private LocalDate billDate;  // 账单日
    
    @Column(name = "due_date")
    private LocalDate dueDate;  // 到期还款日
    
    @Column(name = "bill_amount")
    private BigDecimal billAmount;  // 账单金额
    
    @Column(name = "minimum_payment")
    private BigDecimal minimumPayment;  // 最低还款额
    
    @Column(name = "status")
    private String status;  // UNPAID, PAID, OVERDUE
    
    @OneToMany(mappedBy = "bill")
    private List<Transaction> transactions;  // 交易明细
}

@Service
public class BillService {
    
    /**
     * 生成账单
     */
    public Bill generateBill(Long cardId, LocalDate billDate) {
        // 1. 获取账单周期内的所有交易
        LocalDate startDate = billDate.minusMonths(1);
        List<Transaction> transactions = transactionRepository
            .findByCardIdAndDateRange(cardId, startDate, billDate);
        
        // 2. 计算账单金额
        BigDecimal billAmount = transactions.stream()
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 3. 计算最低还款额（通常是账单金额的10%）
        BigDecimal minimumPayment = billAmount.multiply(new BigDecimal("0.1"))
            .setScale(2, RoundingMode.HALF_UP);
        
        // 4. 计算到期还款日（账单日后20-25天）
        LocalDate dueDate = billDate.plusDays(20);
        
        // 5. 创建账单
        Bill bill = Bill.builder()
            .cardId(cardId)
            .billDate(billDate)
            .dueDate(dueDate)
            .billAmount(billAmount)
            .minimumPayment(minimumPayment)
            .status("UNPAID")
            .build();
        
        return billRepository.save(bill);
    }
}
```

## 免息期（Interest-Free Period）

### 定义
免息期是指从消费日到到期还款日之间，持卡人无需支付利息的时间段。

### 计算规则
- **免息期长度**：通常为 20-56 天
- **起始日**：消费交易入账日
- **结束日**：到期还款日
- **条件**：必须在到期还款日前全额还款

### 代码示例
```java
@Service
public class InterestFreePeriodService {
    
    /**
     * 计算免息期天数
     */
    public int calculateInterestFreeDays(LocalDate transactionDate, LocalDate billDate) {
        // 如果交易在账单日之前，免息期到下一个账单周期
        if (transactionDate.isBefore(billDate)) {
            LocalDate nextBillDate = billDate.plusMonths(1);
            LocalDate dueDate = nextBillDate.plusDays(20);
            return (int) ChronoUnit.DAYS.between(transactionDate, dueDate);
        } else {
            // 如果交易在账单日之后，免息期到当前账单周期的到期日
            LocalDate dueDate = billDate.plusDays(20);
            return (int) ChronoUnit.DAYS.between(transactionDate, dueDate);
        }
    }
    
    /**
     * 判断是否享受免息期
     */
    public boolean isInterestFree(Long cardId, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId);
        Bill bill = billRepository.findLatestBill(cardId);
        
        // 如果已全额还款，享受免息期
        if (bill.getStatus().equals("PAID") && 
            bill.getPaidAmount().compareTo(bill.getBillAmount()) >= 0) {
            return true;
        }
        
        return false;
    }
}
```

## 最低还款额（Minimum Payment）

### 定义
最低还款额是持卡人在到期还款日前必须偿还的最低金额，通常为账单金额的 10%。

### 计算规则
- **基础计算**：账单金额 × 10%
- **最低限额**：通常有最低限额（如 100 元）
- **包含费用**：包括消费本金、利息、手续费等
- **未还部分**：未还部分会产生循环利息

### 代码示例
```java
@Service
public class MinimumPaymentService {
    
    /**
     * 计算最低还款额
     */
    public BigDecimal calculateMinimumPayment(Bill bill) {
        // 基础最低还款额（账单金额的10%）
        BigDecimal baseMinimum = bill.getBillAmount()
            .multiply(new BigDecimal("0.1"))
            .setScale(2, RoundingMode.HALF_UP);
        
        // 加上本期新增的利息和手续费
        BigDecimal fees = bill.getInterest()
            .add(bill.getServiceFee());
        
        BigDecimal totalMinimum = baseMinimum.add(fees);
        
        // 最低限额（如100元）
        BigDecimal minLimit = new BigDecimal("100");
        
        return totalMinimum.compareTo(minLimit) > 0 ? totalMinimum : minLimit;
    }
    
    /**
     * 判断是否满足最低还款
     */
    public boolean isMinimumPaymentMet(Bill bill, BigDecimal paidAmount) {
        BigDecimal minimumPayment = calculateMinimumPayment(bill);
        return paidAmount.compareTo(minimumPayment) >= 0;
    }
}
```

## 循环信用（Revolving Credit）

### 定义
循环信用是指持卡人未全额还款时，未还部分可以继续使用信用额度，但需要支付循环利息。

### 特点
- **灵活性**：可以只还最低还款额
- **产生利息**：未还部分会产生循环利息
- **复利计算**：利息会累加到本金中
- **影响信用**：长期使用循环信用可能影响信用评分

### 代码示例
```java
@Service
public class RevolvingCreditService {
    
    /**
     * 计算循环利息
     */
    public BigDecimal calculateRevolvingInterest(Bill bill) {
        // 未还金额
        BigDecimal unpaidAmount = bill.getBillAmount()
            .subtract(bill.getPaidAmount() != null ? bill.getPaidAmount() : BigDecimal.ZERO);
        
        if (unpaidAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        // 日利率（年利率18% / 365）
        BigDecimal dailyRate = new BigDecimal("0.18")
            .divide(new BigDecimal("365"), 6, RoundingMode.HALF_UP);
        
        // 计息天数（从账单日到还款日）
        int days = (int) ChronoUnit.DAYS.between(
            bill.getBillDate(), 
            LocalDate.now()
        );
        
        // 循环利息 = 未还金额 × 日利率 × 天数
        return unpaidAmount
            .multiply(dailyRate)
            .multiply(BigDecimal.valueOf(days))
            .setScale(2, RoundingMode.HALF_UP);
    }
}
```

## 预授权（Pre-Authorization）

### 定义
预授权是指商户在持卡人消费前，先冻结一定金额的信用额度，待实际消费后再扣款。

### 使用场景
- **酒店预订**：预订时冻结押金
- **租车服务**：租车时冻结押金
- **加油站**：加油前预授权
- **在线支付**：某些场景下的预授权

### 代码示例
```java
@Entity
public class PreAuthorization {
    @Id
    private Long id;
    
    @Column(name = "card_id")
    private Long cardId;
    
    @Column(name = "merchant_id")
    private String merchantId;
    
    @Column(name = "amount")
    private BigDecimal amount;  // 预授权金额
    
    @Column(name = "status")
    private String status;  // PENDING, CONFIRMED, CANCELLED, EXPIRED
    
    @Column(name = "expire_time")
    private LocalDateTime expireTime;  // 预授权过期时间
    
    @Column(name = "create_time")
    private LocalDateTime createTime;
}

@Service
public class PreAuthorizationService {
    
    /**
     * 创建预授权
     */
    @Transactional
    public PreAuthorization createPreAuthorization(Long cardId, BigDecimal amount, String merchantId) {
        Card card = cardRepository.findById(cardId);
        
        // 检查可用额度
        BigDecimal availableCredit = creditLimitService.getAvailableCredit(cardId);
        if (availableCredit.compareTo(amount) < 0) {
            throw new BusinessException("可用额度不足");
        }
        
        // 冻结额度
        card.setFrozenAmount(card.getFrozenAmount().add(amount));
        cardRepository.save(card);
        
        // 创建预授权记录
        PreAuthorization preAuth = PreAuthorization.builder()
            .cardId(cardId)
            .merchantId(merchantId)
            .amount(amount)
            .status("PENDING")
            .expireTime(LocalDateTime.now().plusDays(30))  // 30天后过期
            .createTime(LocalDateTime.now())
            .build();
        
        return preAuthorizationRepository.save(preAuth);
    }
    
    /**
     * 确认预授权（实际扣款）
     */
    @Transactional
    public void confirmPreAuthorization(Long preAuthId, BigDecimal actualAmount) {
        PreAuthorization preAuth = preAuthorizationRepository.findById(preAuthId);
        
        if (!preAuth.getStatus().equals("PENDING")) {
            throw new BusinessException("预授权状态不正确");
        }
        
        // 实际扣款
        transactionService.createTransaction(
            preAuth.getCardId(),
            actualAmount,
            "PRE_AUTH_CONFIRM",
            preAuth.getMerchantId()
        );
        
        // 释放冻结额度
        Card card = cardRepository.findById(preAuth.getCardId());
        card.setFrozenAmount(card.getFrozenAmount().subtract(preAuth.getAmount()));
        cardRepository.save(card);
        
        // 更新预授权状态
        preAuth.setStatus("CONFIRMED");
        preAuthorizationRepository.save(preAuth);
    }
}
```

## 冲正（Reversal）

### 定义
冲正是指撤销之前错误的交易，将账户恢复到交易前的状态。

### 使用场景
- **交易错误**：商户操作错误，需要撤销
- **系统故障**：系统异常导致的重复扣款
- **争议处理**：持卡人提出争议，需要撤销交易

### 代码示例
```java
@Service
public class ReversalService {
    
    /**
     * 执行冲正
     */
    @Transactional
    public void reverseTransaction(Long transactionId, String reason) {
        Transaction originalTransaction = transactionRepository.findById(transactionId);
        
        if (originalTransaction == null) {
            throw new BusinessException("原交易不存在");
        }
        
        // 检查是否已冲正
        if (originalTransaction.getStatus().equals("REVERSED")) {
            throw new BusinessException("交易已冲正");
        }
        
        // 创建冲正交易
        Transaction reversal = Transaction.builder()
            .cardId(originalTransaction.getCardId())
            .amount(originalTransaction.getAmount().negate())  // 负数金额
            .type("REVERSAL")
            .originalTransactionId(transactionId)
            .reason(reason)
            .status("SUCCESS")
            .createTime(LocalDateTime.now())
            .build();
        
        transactionRepository.save(reversal);
        
        // 更新原交易状态
        originalTransaction.setStatus("REVERSED");
        transactionRepository.save(originalTransaction);
        
        // 更新账户余额
        Card card = cardRepository.findById(originalTransaction.getCardId());
        card.setBalance(card.getBalance().subtract(originalTransaction.getAmount()));
        cardRepository.save(card);
    }
}
```

## 争议（Dispute）

### 定义
争议是指持卡人对某笔交易提出异议，要求银行调查并处理。

### 争议类型
- **未授权交易**：持卡人声称未进行该交易
- **商品未收到**：购买商品但未收到
- **商品质量问题**：收到的商品有质量问题
- **重复扣款**：同一笔交易被扣款多次
- **金额不符**：交易金额与实际不符

### 代码示例
```java
@Entity
public class Dispute {
    @Id
    private Long id;
    
    @Column(name = "card_id")
    private Long cardId;
    
    @Column(name = "transaction_id")
    private Long transactionId;
    
    @Column(name = "dispute_type")
    private String disputeType;  // UNAUTHORIZED, NOT_RECEIVED, QUALITY_ISSUE, DUPLICATE, AMOUNT_MISMATCH
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "status")
    private String status;  // PENDING, INVESTIGATING, RESOLVED, REJECTED
    
    @Column(name = "create_time")
    private LocalDateTime createTime;
}

@Service
public class DisputeService {
    
    /**
     * 创建争议
     */
    @Transactional
    public Dispute createDispute(Long cardId, Long transactionId, String disputeType, String description) {
        Transaction transaction = transactionRepository.findById(transactionId);
        
        // 检查交易是否属于该持卡人
        if (!transaction.getCardId().equals(cardId)) {
            throw new BusinessException("交易不属于该持卡人");
        }
        
        // 检查是否在争议期限内（通常为交易后60-90天）
        long daysSinceTransaction = ChronoUnit.DAYS.between(
            transaction.getCreateTime().toLocalDate(),
            LocalDate.now()
        );
        
        if (daysSinceTransaction > 90) {
            throw new BusinessException("已超过争议期限");
        }
        
        // 创建争议记录
        Dispute dispute = Dispute.builder()
            .cardId(cardId)
            .transactionId(transactionId)
            .disputeType(disputeType)
            .description(description)
            .status("PENDING")
            .createTime(LocalDateTime.now())
            .build();
        
        disputeRepository.save(dispute);
        
        // 如果是未授权交易，可能需要临时冻结账户
        if ("UNAUTHORIZED".equals(disputeType)) {
            cardService.freezeCard(cardId);
        }
        
        return dispute;
    }
    
    /**
     * 处理争议
     */
    @Transactional
    public void resolveDispute(Long disputeId, String resolution, boolean favorCustomer) {
        Dispute dispute = disputeRepository.findById(disputeId);
        
        if (favorCustomer) {
            // 支持持卡人，执行冲正
            reversalService.reverseTransaction(
                dispute.getTransactionId(),
                "争议处理：" + resolution
            );
            dispute.setStatus("RESOLVED");
        } else {
            // 不支持持卡人，拒绝争议
            dispute.setStatus("REJECTED");
        }
        
        disputeRepository.save(dispute);
    }
}
```

## 核销（Write-off）

### 定义
核销是指银行将无法收回的坏账从资产负债表中移除，转为损失。

### 核销条件
- **逾期时间**：通常逾期 180 天以上
- **催收无果**：经过多次催收仍无法收回
- **法律程序**：经过法律程序仍无法收回
- **监管要求**：符合监管部门的核销标准

### 代码示例
```java
@Service
public class WriteOffService {
    
    /**
     * 执行核销
     */
    @Transactional
    public void writeOff(Long accountId, String reason) {
        Account account = accountService.getAccount(accountId);
        
        // 检查是否符合核销条件
        if (!isEligibleForWriteOff(account)) {
            throw new BusinessException("不符合核销条件");
        }
        
        // 计算核销金额
        BigDecimal writeOffAmount = account.getOutstandingBalance();
        
        // 更新账户状态
        account.setStatus("WRITTEN_OFF");
        account.setWriteOffAmount(writeOffAmount);
        account.setWriteOffDate(LocalDate.now());
        account.setWriteOffReason(reason);
        accountRepository.save(account);
        
        // 记录核销流水
        WriteOffRecord record = WriteOffRecord.builder()
            .accountId(accountId)
            .amount(writeOffAmount)
            .reason(reason)
            .createTime(LocalDateTime.now())
            .build();
        
        writeOffRecordRepository.save(record);
        
        // 更新银行损失
        bankLossService.recordLoss(writeOffAmount);
    }
    
    /**
     * 判断是否符合核销条件
     */
    private boolean isEligibleForWriteOff(Account account) {
        // 逾期180天以上
        int overdueDays = calculateOverdueDays(account);
        if (overdueDays < 180) {
            return false;
        }
        
        // 经过多次催收
        int collectionAttempts = collectionService.getCollectionAttempts(account.getId());
        if (collectionAttempts < 5) {
            return false;
        }
        
        // 经过法律程序
        if (!legalService.hasLegalAction(account.getId())) {
            return false;
        }
        
        return true;
    }
}
```

## 呆账（Bad Debt）

### 定义
呆账是指经过催收和法律程序后，仍无法收回的坏账。

### 与核销的关系
- **呆账**：是概念，指无法收回的债务
- **核销**：是操作，将呆账从账面上移除

### 代码示例
```java
@Service
public class BadDebtService {
    
    /**
     * 识别呆账
     */
    public List<Account> identifyBadDebts() {
        // 逾期180天以上
        LocalDate cutoffDate = LocalDate.now().minusDays(180);
        
        List<Account> overdueAccounts = accountRepository
            .findOverdueAccounts(cutoffDate);
        
        List<Account> badDebts = new ArrayList<>();
        
        for (Account account : overdueAccounts) {
            // 经过多次催收无果
            if (collectionService.getCollectionAttempts(account.getId()) >= 5) {
                // 经过法律程序
                if (legalService.hasLegalAction(account.getId())) {
                    badDebts.add(account);
                }
            }
        }
        
        return badDebts;
    }
    
    /**
     * 计算呆账率
     */
    public BigDecimal calculateBadDebtRate() {
        // 呆账总额
        BigDecimal badDebtAmount = accountRepository.sumBadDebtAmount();
        
        // 总贷款余额
        BigDecimal totalLoanAmount = accountRepository.sumTotalLoanAmount();
        
        if (totalLoanAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        return badDebtAmount
            .divide(totalLoanAmount, 4, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100));
    }
}
```

## 授信（Credit Granting）

### 定义
授信是指银行根据客户的信用状况，授予一定的信用额度。

### 授信流程
1. **申请**：客户提交信用卡申请
2. **征信查询**：查询客户的信用记录
3. **风险评估**：评估客户的信用风险
4. **额度确定**：根据风险等级确定信用额度
5. **审批**：审批通过后发卡

### 代码示例
```java
@Service
public class CreditGrantingService {
    
    /**
     * 授信审批
     */
    public CreditGrantResult grantCredit(CreditApplication application) {
        // 1. 征信查询
        CreditReport creditReport = creditBureauService.queryCredit(application.getUserId());
        
        // 2. 风险评估
        RiskLevel riskLevel = riskAssessmentService.assessRisk(
            application, 
            creditReport
        );
        
        // 3. 确定信用额度
        BigDecimal creditLimit = calculateCreditLimit(application, riskLevel);
        
        // 4. 审批决策
        if (riskLevel == RiskLevel.HIGH) {
            return CreditGrantResult.rejected("风险等级过高");
        }
        
        // 5. 创建信用卡
        Card card = cardService.createCard(application.getUserId(), creditLimit);
        
        return CreditGrantResult.approved(card);
    }
    
    /**
     * 计算信用额度
     */
    private BigDecimal calculateCreditLimit(CreditApplication application, RiskLevel riskLevel) {
        // 基础额度
        BigDecimal baseLimit = new BigDecimal("10000");
        
        // 根据收入调整
        BigDecimal incomeMultiplier = application.getMonthlyIncome()
            .divide(new BigDecimal("10000"), 2, RoundingMode.HALF_UP);
        baseLimit = baseLimit.multiply(incomeMultiplier);
        
        // 根据风险等级调整
        switch (riskLevel) {
            case LOW:
                baseLimit = baseLimit.multiply(new BigDecimal("1.5"));
                break;
            case MEDIUM:
                // 不变
                break;
            case HIGH:
                baseLimit = baseLimit.multiply(new BigDecimal("0.5"));
                break;
        }
        
        // 设置上限和下限
        BigDecimal maxLimit = new BigDecimal("50000");
        BigDecimal minLimit = new BigDecimal("1000");
        
        if (baseLimit.compareTo(maxLimit) > 0) {
            return maxLimit;
        }
        if (baseLimit.compareTo(minLimit) < 0) {
            return minLimit;
        }
        
        return baseLimit.setScale(0, RoundingMode.HALF_UP);
    }
}
```

## 征信（Credit Investigation）

### 定义
征信是指查询和评估个人或企业的信用记录和信用状况。

### 征信内容
- **基本信息**：身份信息、联系方式
- **信用历史**：过往贷款、信用卡使用记录
- **还款记录**：是否按时还款，是否有逾期
- **负债情况**：当前负债总额
- **信用评分**：综合信用评分

### 代码示例
```java
@Service
public class CreditInvestigationService {
    
    /**
     * 查询征信报告
     */
    public CreditReport queryCreditReport(String userId) {
        // 调用征信机构API
        CreditReport report = creditBureauService.query(userId);
        
        // 计算信用评分
        int creditScore = calculateCreditScore(report);
        report.setCreditScore(creditScore);
        
        return report;
    }
    
    /**
     * 计算信用评分
     */
    private int calculateCreditScore(CreditReport report) {
        int score = 850;  // 基础分
        
        // 还款记录（35%）
        if (report.getPaymentHistory().getLatePayments() > 0) {
            score -= report.getPaymentHistory().getLatePayments() * 10;
        }
        
        // 负债情况（30%）
        BigDecimal debtToIncomeRatio = report.getTotalDebt()
            .divide(report.getAnnualIncome(), 4, RoundingMode.HALF_UP);
        if (debtToIncomeRatio.compareTo(new BigDecimal("0.4")) > 0) {
            score -= 50;
        }
        
        // 信用历史长度（15%）
        int creditHistoryYears = report.getCreditHistoryYears();
        if (creditHistoryYears < 2) {
            score -= 30;
        }
        
        // 信用类型（10%）
        if (report.getCreditTypes().size() < 2) {
            score -= 20;
        }
        
        // 新信用查询（10%）
        if (report.getRecentInquiries() > 5) {
            score -= 20;
        }
        
        return Math.max(300, Math.min(850, score));  // 限制在300-850之间
    }
}
```

## 风险等级（Risk Level）

### 定义
风险等级是根据客户的信用状况、还款能力等因素，将客户划分为不同的风险等级。

### 风险等级划分
- **低风险（LOW）**：信用良好，还款能力强
- **中风险（MEDIUM）**：信用一般，还款能力中等
- **高风险（HIGH）**：信用较差，还款能力弱
- **极高风险（VERY_HIGH）**：信用很差，可能违约

### 代码示例
```java
public enum RiskLevel {
    LOW("低风险", 1),
    MEDIUM("中风险", 2),
    HIGH("高风险", 3),
    VERY_HIGH("极高风险", 4);
    
    private final String description;
    private final int level;
}

@Service
public class RiskAssessmentService {
    
    /**
     * 评估风险等级
     */
    public RiskLevel assessRisk(CreditApplication application, CreditReport creditReport) {
        int riskScore = 0;
        
        // 信用评分
        if (creditReport.getCreditScore() < 600) {
            riskScore += 3;
        } else if (creditReport.getCreditScore() < 700) {
            riskScore += 2;
        } else if (creditReport.getCreditScore() < 750) {
            riskScore += 1;
        }
        
        // 逾期记录
        if (creditReport.getPaymentHistory().getLatePayments() > 3) {
            riskScore += 2;
        } else if (creditReport.getPaymentHistory().getLatePayments() > 0) {
            riskScore += 1;
        }
        
        // 负债率
        BigDecimal debtToIncomeRatio = creditReport.getTotalDebt()
            .divide(application.getAnnualIncome(), 4, RoundingMode.HALF_UP);
        if (debtToIncomeRatio.compareTo(new BigDecimal("0.5")) > 0) {
            riskScore += 2;
        } else if (debtToIncomeRatio.compareTo(new BigDecimal("0.3")) > 0) {
            riskScore += 1;
        }
        
        // 工作稳定性
        if (application.getJobTenure() < 1) {
            riskScore += 1;
        }
        
        // 确定风险等级
        if (riskScore >= 5) {
            return RiskLevel.VERY_HIGH;
        } else if (riskScore >= 3) {
            return RiskLevel.HIGH;
        } else if (riskScore >= 1) {
            return RiskLevel.MEDIUM;
        } else {
            return RiskLevel.LOW;
        }
    }
}
```

## 黑名单/白名单（Blacklist/Whitelist）

### 定义
- **黑名单**：高风险客户名单，可能被拒绝授信或限制使用
- **白名单**：优质客户名单，享受特殊待遇

### 代码示例
```java
@Entity
public class CustomerList {
    @Id
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "list_type")
    private String listType;  // BLACKLIST, WHITELIST
    
    @Column(name = "reason")
    private String reason;
    
    @Column(name = "create_time")
    private LocalDateTime createTime;
}

@Service
public class CustomerListService {
    
    /**
     * 添加到黑名单
     */
    public void addToBlacklist(Long userId, String reason) {
        CustomerList blacklist = CustomerList.builder()
            .userId(userId)
            .listType("BLACKLIST")
            .reason(reason)
            .createTime(LocalDateTime.now())
            .build();
        
        customerListRepository.save(blacklist);
        
        // 冻结账户
        cardService.freezeAllCards(userId);
    }
    
    /**
     * 检查是否在黑名单
     */
    public boolean isBlacklisted(Long userId) {
        return customerListRepository.existsByUserIdAndListType(userId, "BLACKLIST");
    }
    
    /**
     * 添加到白名单
     */
    public void addToWhitelist(Long userId, String reason) {
        CustomerList whitelist = CustomerList.builder()
            .userId(userId)
            .listType("WHITELIST")
            .reason(reason)
            .createTime(LocalDateTime.now())
            .build();
        
        customerListRepository.save(whitelist);
        
        // 提升信用额度
        cardService.increaseCreditLimit(userId, new BigDecimal("20000"));
    }
}
```

## 总结

以上是信用卡业务中的核心概念，包括：

1. **账单相关**：账单、免息期、最低还款额、循环信用
2. **交易相关**：预授权、冲正、争议
3. **风险管理**：核销、呆账、授信、征信、风险等级、黑名单/白名单

这些概念在信用卡业务系统中都有对应的技术实现，理解这些概念有助于更好地设计和开发信用卡业务系统。