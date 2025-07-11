#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test_${TIMESTAMP}@example.com"
TEST_PASSWORD="password123"
TEST_USERNAME="Test User ${TIMESTAMP}"

# Global variables
ACCESS_TOKEN=""
USER_ID=""
WALLET_ID=""
WALLET_ID_2=""
TRANSACTION_ID=""

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to make HTTP requests and check status
make_request() {
    local method=$1
    local url=$2
    local data=$3
    local headers=$4
    
    if [ -n "$headers" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -H "$headers" \
            -d "$data")
    else
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')
    
    echo "$body"
    return "$http_code"
}

# Function to extract JSON value
extract_json_value() {
    local json=$1
    local key=$2
    echo "$json" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list) and len(data) > 0:
        print(data[0].get('$key', ''))
    elif isinstance(data, dict):
        print(data.get('$key', ''))
    else:
        print('')
except:
    print('')
" <<< "$json"
}

# Test 1: User Registration
test_user_registration() {
    print_status "Testing user registration..."
    
    local payload="{
        \"username\": \"$TEST_USERNAME\",
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\"
    }"
    
    response=$(make_request "POST" "$BASE_URL/auth/signup" "$payload")
    status=$?
    
    if [ $status -eq 201 ]; then
        print_success "User registration successful"
        USER_ID=$(extract_json_value "$response" "id")
        echo "User ID: $USER_ID"
    else
        print_error "User registration failed with status $status"
        echo "Response: $response"
        if [ $status -eq 409 ]; then
            print_warning "User already exists, continuing with login..."
        else
            exit 1
        fi
    fi
}

# Test 2: User Login
test_user_login() {
    print_status "Testing user login..."
    
    local payload="{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\"
    }"
    
    response=$(make_request "POST" "$BASE_URL/auth/signin" "$payload")
    status=$?
    
    if [ $status -eq 200 ]; then
        print_success "User login successful"
        ACCESS_TOKEN=$(extract_json_value "$response" "access_token")
        echo "Access Token: ${ACCESS_TOKEN:0:50}..."
    else
        print_error "User login failed with status $status"
        echo "Response: $response"
        exit 1
    fi
}

# Test 3: Verify Token
test_token_verification() {
    print_status "Testing token verification..."
    
    response=$(make_request "GET" "$BASE_URL/auth/verifyToken" "" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 200 ]; then
        print_success "Token verification successful"
        USER_ID=$(extract_json_value "$response" "id")
        echo "Verified User ID: $USER_ID"
    else
        print_error "Token verification failed with status $status"
        echo "Response: $response"
        exit 1
    fi
}

# Test 4: Create Wallet
test_create_wallet() {
    print_status "Testing wallet creation..."
    
    local payload="{
        \"name\": \"Test Wallet\",
        \"type\": \"bank\",
        \"currency\": \"TWD\",
        \"color\": \"#007bff\",
        \"provider\": \"Test Bank\"
    }"
    
    response=$(make_request "POST" "$BASE_URL/wallets" "$payload" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 201 ]; then
        print_success "Wallet creation successful"
        WALLET_ID=$(extract_json_value "$response" "id")
        echo "Wallet ID: $WALLET_ID"
    else
        print_error "Wallet creation failed with status $status"
        echo "Response: $response"
        exit 1
    fi
}

# Test 5: Create Second Wallet (for transfer testing)
test_create_second_wallet() {
    print_status "Testing second wallet creation..."
    
    local payload="{
        \"name\": \"Test Wallet 2\",
        \"type\": \"cash\",
        \"currency\": \"TWD\",
        \"color\": \"#28a745\"
    }"
    
    response=$(make_request "POST" "$BASE_URL/wallets" "$payload" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 201 ]; then
        print_success "Second wallet creation successful"
        WALLET_ID_2=$(extract_json_value "$response" "id")
        echo "Second Wallet ID: $WALLET_ID_2"
    else
        print_error "Second wallet creation failed with status $status"
        echo "Response: $response"
        exit 1
    fi
}

# Test 6: Get All Wallets
test_get_wallets() {
    print_status "Testing get all wallets..."
    
    response=$(make_request "GET" "$BASE_URL/wallets" "" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 200 ]; then
        print_success "Get all wallets successful"
        echo "Response: $response"
    else
        print_error "Get all wallets failed with status $status"
        echo "Response: $response"
    fi
}

# Test 7: Get Specific Wallet
test_get_wallet() {
    print_status "Testing get specific wallet..."
    
    response=$(make_request "GET" "$BASE_URL/wallets/$WALLET_ID" "" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 200 ]; then
        print_success "Get specific wallet successful"
        echo "Response: $response"
    else
        print_error "Get specific wallet failed with status $status"
        echo "Response: $response"
    fi
}

# Test 8: Update Wallet
test_update_wallet() {
    print_status "Testing wallet update..."
    
    local payload="{
        \"name\": \"Updated Wallet\",
        \"color\": \"#dc3545\"
    }"
    
    response=$(make_request "PATCH" "$BASE_URL/wallets/$WALLET_ID" "$payload" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 200 ]; then
        print_success "Wallet update successful"
        echo "Response: $response"
    else
        print_error "Wallet update failed with status $status"
        echo "Response: $response"
    fi
}

# Test 9: Create Transaction
test_create_transaction() {
    print_status "Testing transaction creation..."
    
    local payload="{
        \"walletId\": \"$WALLET_ID\",
        \"amount\": 1000,
        \"description\": \"Test Income\",
        \"type\": \"income\",
        \"category\": \"Salary\"
    }"
    
    response=$(make_request "POST" "$BASE_URL/transactions" "$payload" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 201 ]; then
        print_success "Transaction creation successful"
        TRANSACTION_ID=$(extract_json_value "$response" "id")
        echo "Transaction ID: $TRANSACTION_ID"
    else
        print_error "Transaction creation failed with status $status"
        echo "Response: $response"
        exit 1
    fi
}

# Test 10: Create Expense Transaction
test_create_expense() {
    print_status "Testing expense transaction creation..."
    
    local payload="{
        \"walletId\": \"$WALLET_ID\",
        \"amount\": 200,
        \"description\": \"Lunch Expense\",
        \"type\": \"expense\",
        \"category\": \"Food\"
    }"
    
    response=$(make_request "POST" "$BASE_URL/transactions" "$payload" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 201 ]; then
        print_success "Expense transaction creation successful"
        echo "Response: $response"
    else
        print_error "Expense transaction creation failed with status $status"
        echo "Response: $response"
    fi
}

# Test 11: Create Transfer
test_create_transfer() {
    print_status "Testing transfer creation..."
    
    local payload="{
        \"fromWalletId\": \"$WALLET_ID\",
        \"toWalletId\": \"$WALLET_ID_2\",
        \"amount\": 300,
        \"description\": \"Wallet Transfer\"
    }"
    
    response=$(make_request "POST" "$BASE_URL/transactions/transfer" "$payload" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 201 ]; then
        print_success "Transfer creation successful"
        echo "Response: $response"
    else
        print_error "Transfer creation failed with status $status"
        echo "Response: $response"
    fi
}

# Test 12: Get All Transactions
test_get_transactions() {
    print_status "Testing get all transactions..."
    
    response=$(make_request "GET" "$BASE_URL/transactions" "" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 200 ]; then
        print_success "Get all transactions successful"
        echo "Response: $response"
    else
        print_error "Get all transactions failed with status $status"
        echo "Response: $response"
    fi
}

# Test 13: Get Transactions by Wallet
test_get_transactions_by_wallet() {
    print_status "Testing get transactions by wallet..."
    
    response=$(make_request "GET" "$BASE_URL/transactions?walletId=$WALLET_ID" "" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 200 ]; then
        print_success "Get transactions by wallet successful"
        echo "Response: $response"
    else
        print_error "Get transactions by wallet failed with status $status"
        echo "Response: $response"
    fi
}

# Test 14: Get Transactions by Category
test_get_transactions_by_category() {
    print_status "Testing get transactions by category..."
    
    response=$(make_request "GET" "$BASE_URL/transactions/category/Food" "" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 200 ]; then
        print_success "Get transactions by category successful"
        echo "Response: $response"
    else
        print_error "Get transactions by category failed with status $status"
        echo "Response: $response"
    fi
}

# Test 15: Get Specific Transaction
test_get_transaction() {
    print_status "Testing get specific transaction..."
    
    response=$(make_request "GET" "$BASE_URL/transactions/$TRANSACTION_ID" "" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 200 ]; then
        print_success "Get specific transaction successful"
        echo "Response: $response"
    else
        print_error "Get specific transaction failed with status $status"
        echo "Response: $response"
    fi
}

# Test 16: Update Transaction
test_update_transaction() {
    print_status "Testing transaction update..."
    
    local payload="{
        \"description\": \"Updated Transaction Description\",
        \"category\": \"Updated Category\"
    }"
    
    response=$(make_request "PATCH" "$BASE_URL/transactions/$TRANSACTION_ID" "$payload" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 200 ]; then
        print_success "Transaction update successful"
        echo "Response: $response"
    else
        print_error "Transaction update failed with status $status"
        echo "Response: $response"
    fi
}

# Test 17: Get Wallet Balance
test_get_wallet_balance() {
    print_status "Testing get wallet balance..."
    
    response=$(make_request "GET" "$BASE_URL/wallets/$WALLET_ID/balance" "" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 200 ]; then
        print_success "Get wallet balance successful"
        echo "Balance: $response"
    else
        print_error "Get wallet balance failed with status $status"
        echo "Response: $response"
    fi
}

# Test 18: Delete Transaction
test_delete_transaction() {
    print_status "Testing transaction deletion..."
    
    response=$(make_request "DELETE" "$BASE_URL/transactions/$TRANSACTION_ID" "" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 200 ] || [ $status -eq 204 ]; then
        print_success "Transaction deletion successful"
    else
        print_error "Transaction deletion failed with status $status"
        echo "Response: $response"
    fi
}

# Test 19: Delete Wallet
test_delete_wallet() {
    print_status "Testing wallet deletion..."
    
    response=$(make_request "DELETE" "$BASE_URL/wallets/$WALLET_ID_2" "" "Authorization: Bearer $ACCESS_TOKEN")
    status=$?
    
    if [ $status -eq 200 ] || [ $status -eq 204 ]; then
        print_success "Wallet deletion successful"
    else
        print_error "Wallet deletion failed with status $status"
        echo "Response: $response"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}          Wallet API Test Suite            ${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
    
    # Authentication Tests
    echo -e "${YELLOW}--- Authentication Tests ---${NC}"
    test_user_registration
    test_user_login
    test_token_verification
    echo ""
    
    # Wallet Tests
    echo -e "${YELLOW}--- Wallet Tests ---${NC}"
    test_create_wallet
    test_create_second_wallet
    test_get_wallets
    test_get_wallet
    test_update_wallet
    echo ""
    
    # Transaction Tests
    echo -e "${YELLOW}--- Transaction Tests ---${NC}"
    test_create_transaction
    test_create_expense
    test_create_transfer
    test_get_transactions
    test_get_transactions_by_wallet
    test_get_transactions_by_category
    test_get_transaction
    test_update_transaction
    echo ""
    
    # Balance Tests
    echo -e "${YELLOW}--- Balance Tests ---${NC}"
    test_get_wallet_balance
    echo ""
    
    # Cleanup Tests
    echo -e "${YELLOW}--- Cleanup Tests ---${NC}"
    test_delete_transaction
    test_delete_wallet
    echo ""
    
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}          All Tests Completed!            ${NC}"
    echo -e "${GREEN}============================================${NC}"
}

# Check if curl is available
if ! command -v curl &> /dev/null; then
    print_error "curl is required but not installed."
    exit 1
fi

# Check if server is running
if ! curl -s "$BASE_URL" > /dev/null; then
    print_error "Server is not running at $BASE_URL"
    print_warning "Please make sure the backend server is running before executing tests"
    exit 1
fi

# Run all tests
main